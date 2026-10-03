/**
 * Anti-DevTools Deterrence & Detection Engine
 *
 * Implements multi-vector detection:
 * 1. Window dimension delta heuristics (detects docked DevTools on right, bottom, left)
 * 2. Debugger timing heuristics (detects undocked / detached DevTools windows)
 * 3. Console getter & inspection deterrence
 * 4. Keyboard shortcuts suppression (F12, Ctrl+Shift+I/J/C/K/E, Cmd+Opt+I/J/C/K/E, Ctrl+U, Ctrl+S)
 * 5. Context menu (right-click) suppression
 * 6. Real-time active verification via checkIsOpen()
 */

type DevToolsListener = (detected: boolean) => void;

class AntiDevToolsManager {
  private isDetected: boolean = false;
  private listeners: Set<DevToolsListener> = new Set();
  private intervalId: number | null = null;
  private isMonitoring: boolean = false;

  // Track baseline dimensions for iframe resilience
  private baselineWidth: number = 0;
  private baselineHeight: number = 0;
  private consoleTriggered: boolean = false;

  public subscribe(listener: DevToolsListener): () => void {
    this.listeners.add(listener);
    listener(this.isDetected);
    return () => this.listeners.delete(listener);
  }

  public notify(detected: boolean) {
    if (this.isDetected !== detected) {
      this.isDetected = detected;
      this.listeners.forEach((fn) => fn(detected));
    }
  }

  public resume() {
    this.isDetected = false;
    this.listeners.forEach((fn) => fn(false));
  }

  public getIsDetected(): boolean {
    return this.isDetected;
  }

  /**
   * Vector 1: Dimension Delta Check
   * When DevTools is docked (to bottom, right, or left), inner dimensions shrink
   * significantly relative to outer dimensions or relative to the baseline.
   */
  public checkDimensionDelta(): boolean {
    if (typeof window === 'undefined') return false;

    // Check if inside an iframe
    let isIframe = false;
    try {
      isIframe = window.self !== window.top;
    } catch {
      isIframe = true;
    }

    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    // Normal browser chrome has outerWidth - innerWidth ~ 0-25px,
    // and outerHeight - innerHeight ~ 70-140px.
    // Docked DevTools takes at least 180px in width or 200px in height.
    if (!isIframe) {
      if (widthDiff > 160 || heightDiff > 220) {
        return true;
      }
    } else {
      // In an iframe (e.g. preview environment), check sudden shrink from baseline
      if (this.baselineWidth > 0 && this.baselineHeight > 0) {
        const deltaWidth = this.baselineWidth - window.innerWidth;
        const deltaHeight = this.baselineHeight - window.innerHeight;
        if (deltaWidth > 160 || deltaHeight > 160) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Vector 2: Debugger Timing Heuristic
   * Detects undocked (detached window) and docked DevTools.
   * When DevTools is OPEN, a debugger statement causes execution to pause or invoke
   * the debugger handler, making duration > 80ms.
   * When DevTools is CLOSED, Function('debugger')() completes in < 0.05ms.
   */
  public checkDebuggerTiming(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const start = performance.now();
      // Function constructor prevents bundler optimization / dead code elimination
      const fn = new Function('debugger');
      fn();
      const elapsed = performance.now() - start;
      if (elapsed > 80) {
        return true;
      }
    } catch {
      // Ignore
    }
    return false;
  }

  /**
   * Vector 3: Console Object / RegExp Getter Heuristic
   * When DevTools is open (especially Console / Elements tab), browser attempts
   * to format logged objects, invoking their getters / toString().
   */
  public checkConsoleInspection(): boolean {
    if (typeof window === 'undefined') return false;
    this.consoleTriggered = false;
    try {
      const self = this;
      const reg = /./;
      reg.toString = function () {
        self.consoleTriggered = true;
        return '';
      };
      // Trigger evaluation
      console.log('%c', reg);
      if (this.consoleTriggered) {
        return true;
      }
    } catch {
      // Ignore
    }
    return false;
  }

  /**
   * Active verification across all vectors:
   * Returns true if DevTools is currently active.
   */
  public checkIsOpen(): boolean {
    if (typeof window === 'undefined') return false;

    // Quick check 1: Dimension delta (Docked)
    if (this.checkDimensionDelta()) {
      return true;
    }

    // Quick check 2: Debugger timing (Undocked & Docked)
    if (this.checkDebuggerTiming()) {
      return true;
    }

    // Quick check 3: Console inspection
    if (this.checkConsoleInspection()) {
      return true;
    }

    return false;
  }

  public init() {
    if (typeof window === 'undefined' || this.isMonitoring) return;
    this.isMonitoring = true;

    this.baselineWidth = window.innerWidth;
    this.baselineHeight = window.innerHeight;

    // 1. Keyboard Shortcut Deterrence
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          e.stopPropagation();
          this.notify(true);
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
          this.notify(true);
          return false;
        }

        // Ctrl + U (View Source)
        if (isCmdOrCtrl && (e.key === 'U' || e.key === 'u')) {
          e.preventDefault();
          e.stopPropagation();
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

    // 2. Context Menu (Right Click) Suppression
    window.addEventListener(
      'contextmenu',
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      { capture: true }
    );

    // 3. Drag Start Suppression (prevent dragging links/text to expose URLs)
    window.addEventListener(
      'dragstart',
      (e: DragEvent) => {
        e.preventDefault();
      },
      { capture: true }
    );

    // 4. Window Resize Listener (Immediate detection when 3-dots menu docks DevTools)
    window.addEventListener('resize', () => {
      if (this.checkDimensionDelta()) {
        this.notify(true);
      }
    });

    // 5. Window Focus Listener (Detects when user interacts back with page after DevTools)
    window.addEventListener('focus', () => {
      if (this.checkIsOpen()) {
        this.notify(true);
      }
    });

    // 6. Continuous Background Monitoring Loop (Runs every 400ms)
    this.startDetectionLoop();
  }

  private startDetectionLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      // If already flagged as detected, wait for user resolution
      if (this.isDetected) return;

      if (this.checkIsOpen()) {
        this.notify(true);
      }
    }, 400);
  }

  public destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    this.listeners.clear();
  }
}

export const antiDevTools = new AntiDevToolsManager();
