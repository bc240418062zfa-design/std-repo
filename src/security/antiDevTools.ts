/**
 * Advanced Anti-DevTools Deterrence & Detection Engine
 * Powered by disable-devtool (https://github.com/theajack/disable-devtool)
 * 
 * Capabilities:
 * 1. Multi-vector inspection detection:
 *    - Size (Docked DevTools viewport geometry shrinkage)
 *    - Debugger (Timing performance / execution pause)
 *    - DefineId (DOM property inspection probe)
 *    - DebugLib (Eruda / vConsole third-party mobile injectors)
 * 2. Instant keyboard shortcut deterrence (F12, Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C, Ctrl+U, Ctrl+S)
 * 3. Right-click context menu suppression (disableMenu)
 * 4. Safe AI Studio Preview & iframe parent isolation (disableIframeParents: false)
 * 5. Telemetry-safe execution (prevents JSON serialization collision in dev iframes)
 * 6. Live resume & graceful study session restoration
 */

import disableDevtool from 'disable-devtool';

export enum DetectorType {
  Unknown = -1,
  RegToString = 0,
  DefineId = 1,
  Size = 2,
  DateToString = 3,
  FuncToString = 4,
  Debugger = 5,
  Performance = 6,
  DebugLib = 7
}

export type DevToolsDetectionDetail = {
  detected: boolean;
  detectorType?: DetectorType | number;
  detectorName?: string;
  timestamp?: number;
};

type DevToolsListener = (detail: DevToolsDetectionDetail) => void;

class AntiDevToolsManager {
  private isDetected: boolean = false;
  private currentDetail: DevToolsDetectionDetail = { detected: false };
  private listeners: Set<DevToolsListener> = new Set();
  private isInitialized: boolean = false;
  private resumeCooldownUntil: number = 0;

  public subscribe(listener: DevToolsListener): () => void {
    this.listeners.add(listener);
    listener(this.currentDetail);
    return () => this.listeners.delete(listener);
  }

  public notify(detected: boolean, type: DetectorType = DetectorType.Unknown, reason?: string) {
    // If user recently clicked resume, respect grace cooldown for 5 seconds
    if (detected && Date.now() < this.resumeCooldownUntil) {
      return;
    }

    // Suppress viewport size false positives on mobile / small screen devices
    if (detected && type === DetectorType.Size && typeof window !== 'undefined') {
      const isMobile = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024) ||
        window.innerWidth < 768;
      if (isMobile) return;
    }

    const detectorName = reason || this.getDetectorName(type);
    this.isDetected = detected;
    this.currentDetail = {
      detected,
      detectorType: type,
      detectorName: detected ? detectorName : undefined,
      timestamp: Date.now()
    };

    this.listeners.forEach((fn) => fn(this.currentDetail));
  }

  public resume() {
    this.isDetected = false;
    this.resumeCooldownUntil = Date.now() + 5000; // 5-second grace window after explicit resume
    this.currentDetail = { detected: false, timestamp: Date.now() };
    this.listeners.forEach((fn) => fn(this.currentDetail));
  }

  public getIsDetected(): boolean {
    return this.isDetected;
  }

  public getCurrentDetail(): DevToolsDetectionDetail {
    return this.currentDetail;
  }

  public getDetectorName(type: DetectorType | number): string {
    switch (type) {
      case DetectorType.RegToString:
        return 'RegExp Evaluation Trap (RegToString)';
      case DetectorType.DefineId:
        return 'DOM & Property Inspector (DefineId)';
      case DetectorType.Size:
        return 'Docked Viewport Geometry Shrinkage (Size)';
      case DetectorType.DateToString:
        return 'Date Evaluation Interception (DateToString)';
      case DetectorType.FuncToString:
        return 'Function Decompiler Probe (FuncToString)';
      case DetectorType.Debugger:
        return 'Execution Timing Probe (Debugger)';
      case DetectorType.Performance:
        return 'Execution Profiler Delay (Performance)';
      case DetectorType.DebugLib:
        return 'Third-Party Console Injection (DebugLib)';
      default:
        return 'Keyboard Shortcut / Inspector Action';
    }
  }

  public init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // Guard against host telemetry JSON errors in dev iframes
    window.addEventListener('error', (e: ErrorEvent) => {
      if (e.message && (e.message.includes('not valid JSON') || e.message.includes('JSON.parse'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { capture: true });

    // SEO & Search Crawler Safe Bypass: Allow Googlebot, Bing, Lighthouse & Headless indexing
    try {
      const ua = (navigator.userAgent || '').toLowerCase();
      const isCrawler = 
        navigator.webdriver ||
        /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|ia_archiver|chrome-lighthouse|headlesschrome|google-extended|petalbot|bytespider|gptbot|claudebot|perplexitybot|applebot|screaming frog|semrushbot/i.test(ua);
      if (isCrawler) {
        return;
      }
    } catch {
      // Ignore
    }

    // Check if bypass token is in URL (e.g. ?ddtk=bypass or ?dev_bypass=1)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('ddtk') === 'bypass' || urlParams.get('dev_bypass') === '1') {
        console.info('[Security] Anti-DevTools bypass flag active.');
        return;
      }
    } catch {
      // Ignore URL parsing errors
    }

    // Check if running on mobile device or touch viewport
    const isMobile = 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024);

    // 1. Initialize disable-devtool engine with safe, robust detectors
    try {
      const activeDetectors = isMobile
        ? [DetectorType.Debugger, DetectorType.DebugLib]
        : [DetectorType.Size, DetectorType.Debugger, DetectorType.DefineId, DetectorType.DebugLib];

      disableDevtool({
        // Triggered when any inspection detector fires
        ondevtoolopen: (type: number) => {
          // Double check: Never trigger Size false positive on mobile devices
          if (type === DetectorType.Size && (isMobile || window.innerWidth < 768)) {
            return;
          }
          this.notify(true, type as DetectorType);
        },
        // Triggered when DevTools is closed
        ondevtoolclose: () => {
          this.notify(false);
        },
        disableMenu: !isMobile, // Keep long-press menu functional on mobile phones
        disableSelect: false, // Keep educational notes selectable
        disableCopy: false, // Keep student text copyable
        disableCut: false,
        disablePaste: false,
        clearLog: false, // Keep false to preserve preview host message passing
        disableIframeParents: false, // Crucial: Safe for Google AI Studio preview iframe
        seo: true, // Search engine crawler friendly
        interval: isMobile ? 800 : 300, // Balanced frequency on mobile
        detectors: activeDetectors
      });
    } catch (err) {
      console.warn('[Security] disable-devtool core initialization:', err);
    }

    // 2. Extra Key Combinations Deterrence (Immediate capture)
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          e.stopPropagation();
          this.notify(true, DetectorType.Unknown, 'Function Key (F12)');
          return false;
        }

        const isCmdOrCtrl = e.ctrlKey || e.metaKey;
        const isShiftOrAlt = e.shiftKey || e.altKey;

        // Ctrl + Shift + I / J / C / K / E or Cmd + Option + I / J / C / K / E
        if (
          isCmdOrCtrl &&
          isShiftOrAlt &&
          ['i', 'j', 'c', 'k', 'e', 'I', 'J', 'C', 'K', 'E'].includes(e.key)
        ) {
          e.preventDefault();
          e.stopPropagation();
          this.notify(true, DetectorType.Unknown, `DevTools Shortcut (${isCmdOrCtrl ? 'Ctrl/Cmd+' : ''}${e.key.toUpperCase()})`);
          return false;
        }

        // Ctrl + U (View Source)
        if (isCmdOrCtrl && (e.key === 'U' || e.key === 'u')) {
          e.preventDefault();
          e.stopPropagation();
          this.notify(true, DetectorType.Unknown, 'View Page Source Shortcut (Ctrl+U)');
          return false;
        }

        // Ctrl + S (Save Page)
        if (isCmdOrCtrl && (e.key === 'S' || e.key === 's')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      },
      { capture: true }
    );

    // 3. Context Menu (Right Click) Extra Capture
    window.addEventListener(
      'contextmenu',
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      { capture: true }
    );

    // 4. Drag Start Suppression (prevent dragging elements to inspect URLs)
    window.addEventListener(
      'dragstart',
      (e: DragEvent) => {
        e.preventDefault();
      },
      { capture: true }
    );
  }

  public destroy() {
    this.isInitialized = false;
    this.listeners.clear();
  }
}

export const antiDevTools = new AntiDevToolsManager();
