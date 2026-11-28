import fs from 'fs';
import path from 'path';

// Sensitive patterns that must NEVER appear in public assets
const LEAK_PATTERNS = [
  /https?:\/\/drive\.google\.com\/[^\s"')]+/i,
  /https?:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[^\s"')]+/i,
  /drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+/i,
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,
  /"type":\s*"service_account"/,
  /"private_key":\s*"-----BEGIN/,
  /GOOGLE_APPLICATION_CREDENTIALS/,
  /RESOURCE_MAP_ENCRYPTION_KEY/
];

export function auditDirectory(dirPath: string): number {
  let violations = 0;
  if (!fs.existsSync(dirPath)) return 0;

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      violations += auditDirectory(fullPath);
    } else {
      // Skip binary media or map files if excluded
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.ico')) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');

      for (const pattern of LEAK_PATTERNS) {
        const match = pattern.exec(content);
        if (match) {
          const matchIdx = match.index;
          const snippet = content.substring(Math.max(0, matchIdx - 30), Math.min(content.length, matchIdx + 60)).replace(/[\r\n]+/g, ' ');
          console.error(`🚨 FATAL SECURITY AUDIT FAILURE: File '${fullPath}' matched forbidden pattern: ${pattern.toString()}`);
          console.error(`   Context: "...${snippet}..."`);
          violations++;
        }
      }
    }
  }

  return violations;
}

export function runAudit() {
  console.log('🛡️ Running comprehensive public leak audit (Part 42 / 43 / 58)...');

  // Check public directory, src/data, and dist if built
  const targetDirs = [
    path.resolve('src/data'),
    path.resolve('public'),
    path.resolve('dist')
  ].filter(d => fs.existsSync(d));

  let totalViolations = 0;
  for (const dir of targetDirs) {
    console.log(`Scanning ${dir}...`);
    totalViolations += auditDirectory(dir);
  }

  if (totalViolations > 0) {
    console.error(`❌ Security audit failed: ${totalViolations} forbidden patterns discovered in public assets!`);
    process.exit(1);
  }

  // Branded 404 fallback guard: when dist/ exists (i.e. after a build),
  // dist/404.html must carry the injected no-JS fallback block. The
  // deploy workflow used to re-copy index.html over 404.html AFTER the
  // build, silently erasing it — the live 404 page then served the plain
  // SPA shell. Fail the build loudly if the fallback ever goes missing
  // again, so a broken 404 can never reach the deploy.
  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    const fallbackPath = path.join(distDir, '404.html');
    const fallbackHtml = fs.existsSync(fallbackPath)
      ? fs.readFileSync(fallbackPath, 'utf-8')
      : '';
    if (!fallbackHtml.includes('data-mihora-404-fallback')) {
      console.error(
        '❌ Security audit failed: dist/404.html is missing the branded no-JS fallback block (data-mihora-404-fallback). ' +
          'The build injects it into dist/404.html — do not overwrite 404.html after the build.'
      );
      process.exit(1);
    }
    console.log('✅ Branded no-JS 404 fallback present in dist/404.html.');
  }

  console.log('✅ Public security audit passed! Zero Drive links, zero service account keys, zero raw credentials found.');
}

if (process.argv[1] && process.argv[1].endsWith('audit-public.ts')) {
  runAudit();
}
