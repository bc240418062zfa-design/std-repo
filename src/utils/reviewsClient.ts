import reviewsIndexData from '../data/reviews/index.json';
import { CourseReviewSummary, ReviewItem } from '../types';

export const reviewsIndex: CourseReviewSummary[] = reviewsIndexData as CourseReviewSummary[];

export interface ReviewsResponse {
  ok: boolean;
  course: string;
  page: number;
  limit: number;
  totalReviews: number;
  totalPages: number;
  watermark: string;
  reviews: ReviewItem[];
  error?: string;
}

// Client-side rate-limiting and anti-scraping guard
let clientRequestTimes: number[] = [];
const CLIENT_MAX_PER_MINUTE = 40;

function checkClientRateLimit(): boolean {
  const now = Date.now();
  clientRequestTimes = clientRequestTimes.filter((t) => now - t < 60000);
  if (clientRequestTimes.length >= CLIENT_MAX_PER_MINUTE) {
    return false;
  }
  clientRequestTimes.push(now);
  return true;
}

// Map of statically loaded modules for client-side fallback
const shardModules = import.meta.glob('../data/reviews/courses/*.json');

/**
 * Fetch reviews for a course with server-first fallback to client shard
 * Enforces pagination (max 10-15 per page) and anti-scraping controls
 */
export async function fetchCourseReviews(
  courseCode: string,
  page = 1,
  limit = 10,
  searchQuery = ''
): Promise<ReviewsResponse> {
  const code = (courseCode || 'CS101').toUpperCase().trim();

  // Enforce client-side rate throttling against automated scraping
  if (!checkClientRateLimit()) {
    return {
      ok: false,
      course: code,
      page,
      limit,
      totalReviews: 0,
      totalPages: 1,
      watermark: 'MIHORA TECH · Protected Student Archive',
      reviews: [],
      error: 'Anti-scraping defense: You have made multiple rapid requests. Please wait a moment.'
    };
  }

  // 1. Try Server-Side API first (active in dev/node server)
  try {
    const params = new URLSearchParams({
      course: code,
      page: String(page),
      limit: String(Math.min(15, limit))
    });
    if (searchQuery) params.append('search', searchQuery);

    const res = await fetch(`/api/reviews?${params.toString()}`);
    if (res.ok) {
      const data: ReviewsResponse = await res.json();
      if (data && data.ok) {
        return data;
      }
    } else if (res.status === 429) {
      const errData = await res.json().catch(() => ({}));
      return {
        ok: false,
        course: code,
        page,
        limit,
        totalReviews: 0,
        totalPages: 1,
        watermark: 'MIHORA TECH · Protected Student Archive',
        reviews: [],
        error: errData.error || 'Rate limit reached. Automated bulk scraping is restricted.'
      };
    }
  } catch {
    // Fall back to client-side static shard import
  }

  // 2. Client-side shard fallback (for static hosting or offline)
  try {
    const key = `../data/reviews/courses/${code}.json`;
    const loader = shardModules[key];
    if (!loader) {
      return {
        ok: false,
        course: code,
        page: 1,
        limit,
        totalReviews: 0,
        totalPages: 1,
        watermark: 'MIHORA TECH · Protected Student Archive',
        reviews: [],
        error: `No exam reviews found for course ${code}.`
      };
    }

    const mod: any = await loader();
    const rawList: ReviewItem[] = (mod.default || mod) as ReviewItem[];

    let filtered = rawList;
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      filtered = rawList.filter((r) => {
        const msg = (r.message || '').toLowerCase();
        const pts = (r.keyPoints || []).join(' ').toLowerCase();
        return msg.includes(q) || pts.includes(q);
      });
    }

    const safeLimit = Math.min(15, Math.max(1, limit));
    const safePage = Math.max(1, page);
    const totalReviews = filtered.length;
    const totalPages = Math.ceil(totalReviews / safeLimit) || 1;
    const startIndex = (safePage - 1) * safeLimit;
    const reviews = filtered.slice(startIndex, startIndex + safeLimit);

    return {
      ok: true,
      course: code,
      page: safePage,
      limit: safeLimit,
      totalReviews,
      totalPages,
      watermark: 'MIHORA TECH © 2026 · Anti-Scrape Protected Archive',
      reviews
    };
  } catch (err: any) {
    return {
      ok: false,
      course: code,
      page: 1,
      limit,
      totalReviews: 0,
      totalPages: 1,
      watermark: 'MIHORA TECH · Protected Student Archive',
      reviews: [],
      error: err.message || 'Failed to load course reviews.'
    };
  }
}
