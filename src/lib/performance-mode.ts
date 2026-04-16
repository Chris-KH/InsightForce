const SAFE_MODE_UNTIL_STORAGE_KEY =
  "insightforce.performance.safe-mode-until.v1";
const DEFAULT_SAFE_MODE_DURATION_MS = 6 * 60 * 60 * 1000;

function safeNow() {
  return Date.now();
}

export function enablePerformanceSafeMode(
  durationMs = DEFAULT_SAFE_MODE_DURATION_MS,
) {
  if (typeof window === "undefined") {
    return;
  }

  const safeModeUntil = safeNow() + Math.max(1, durationMs);
  window.localStorage.setItem(
    SAFE_MODE_UNTIL_STORAGE_KEY,
    String(safeModeUntil),
  );
}

export function disablePerformanceSafeMode() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SAFE_MODE_UNTIL_STORAGE_KEY);
}

export function isPerformanceSafeModeActive() {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = window.localStorage.getItem(SAFE_MODE_UNTIL_STORAGE_KEY);
  if (!raw) {
    return false;
  }

  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp)) {
    window.localStorage.removeItem(SAFE_MODE_UNTIL_STORAGE_KEY);
    return false;
  }

  if (safeNow() > timestamp) {
    window.localStorage.removeItem(SAFE_MODE_UNTIL_STORAGE_KEY);
    return false;
  }

  return true;
}
