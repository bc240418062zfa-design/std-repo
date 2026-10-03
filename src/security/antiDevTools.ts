/**
 * Anti-DevTools Deterrence & Detection Engine (Production Grade & Zero False Positives)
 *
 * Implements:
 * 1. Keyboard shortcuts deterrence (F12, Ctrl+Shift+I/J/C/K/E, Cmd+Opt+I/J/C/K/E, Ctrl+U, Ctrl+S)
 * 2. Context menu (right-click) suppression
 * 3. Drag-and-drop suppression
 * 4. Desktop-only docked DevTools detection via relative viewport shrinkage (Zero false alarms on load)
 * 5. Full mobile/tablet immunity (mobile browsers never trigger false positives)
 * 6. Clean, instant resume interface
 */

type DevToolsListener = (detected: boolean) => void;

function isTouchOrMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window && window.innerWidth < 1024)
  );
}

class AntiDevToolsManager {
  private isDetected: boolean = false;
  private listeners: Set<DevToolsListener> = new Set();
  private isMonitoring: boolean = false;

  // Baseline window geometry
  private baselineInnerWidth: number = 0;
  private baselineOuterWidth: number = 0;
  private baselineInnerHeight: number = 0;
  private baselineOuterHeight: number = 0;

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
    if (typeof window !== 'undefined') {
      this.baselineInnerWidth = window.innerWidth;
      this.baselineOuterWidth = window.outerWidth;
      this.baselineInnerHeight = window.innerHeight;
      this.baselineOuterHeight = window.outerHeight;
    }
    this.listeners.forEach((fn) => fn(false));
  }

  public getIsDetected(): boolean {
    return this.isDetected;
  }

  /**
   * Safe check if DevTools is currently open on desktop
   */
  public checkIsOpen(): boolean {
    if (typeof window === 'undefined') return false;
    if (isTouchOrMobileDevice()) return false;

    // Check if inner dimensions shrunk significantly while outer dimensions stayed the same
    if (this.baselineOuterWidth > 0 && this.baselineOuterHeight > 0) {
      const outerWidthStable = Math.abs(window.outerWidth - this.baselineOuterWidth) < 40;
      const outerHeightStable = Math.abs(window.outerHeight - this.baselineOuterHeight) < 40;

      const innerWidthDrop = this.baselineInnerWidth - window.innerWidth;
      const innerHeightDrop = this.baselineInnerHeight - window.innerHeight;

      // Docked DevTools consumes at least 260px
      if ((outerWidthStable && innerWidthDrop > 260) || (outerHeightStable && innerHeightDrop > 260)) {
        return true;
      }
    }

    return false;
  }

  public init() {
    if (typeof window === 'undefined' || this.isMonitoring) return;
    this.isMonitoring = true;

    // Record initial baseline
    this.baselineInnerWidth = window.innerWidth;
    this.baselineOuterWidth = window.outerWidth;
    this.baselineInnerHeight = window.innerHeight;
    this.baselineOuterHeight = window.outerHeight;

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

    // 3. Drag Start Suppression (prevent dragging links to expose URLs)
    window.addEventListener(
      'dragstart',
      (e: DragEvent) => {
        e.preventDefault();
      },
      { capture: true }
    );

    // 4. Desktop-only Resize Listener (Fires when DevTools is opened via 3-dots menu)
    window.addEventListener('resize', () => {
      if (isTouchOrMobileDevice()) return;

      const outerWidthStable = Math.abs(window.outerWidth - this.baselineOuterWidth) < 40;
      const outerHeightStable = Math.abs(window.outerHeight - this.baselineOuterHeight) < 40;

      const innerWidthDrop = this.baselineInnerWidth - window.innerWidth;
      const innerHeightDrop = this.baselineInnerHeight - window.innerHeight;

      // If browser window didn't change size, but viewport suddenly lost 260px+, DevTools was docked
      if ((outerWidthStable && innerWidthDrop > 260) || (outerHeightStable && innerHeightDrop > 260)) {
        this.notify(true);
      } else if (!outerWidthStable || !outerHeightStable) {
        // User legitimately resized the browser window; update baseline
        this.baselineInnerWidth = window.innerWidth;
        this.baselineOuterWidth = window.outerWidth;
        this.baselineInnerHeight = window.innerHeight;
        this.baselineOuterHeight = window.outerHeight;
      }
    });
  }

  public destroy() {
    this.isMonitoring = false;
    this.listeners.clear();
  }
}

export const antiDevTools = new AntiDevToolsManager();
