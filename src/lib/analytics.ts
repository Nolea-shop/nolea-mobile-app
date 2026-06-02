type AnalyticsPayload = Record<string, unknown>;

const STORAGE_KEY = 'nolea_analytics_events';
const MAX_EVENTS = 80;

export function trackAppEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  const entry = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const events = Array.isArray(existing) ? existing : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...events.slice(-(MAX_EVENTS - 1)), entry]));
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry]));
  }

  if ((window as any).pintrk && event === 'checkout_started') {
    (window as any).pintrk('track', 'checkout', payload);
  }

  if (import.meta.env.DEV) {
    console.info('[Nolea analytics]', event, payload);
  }
}

export function getStoredAnalyticsEvents() {
  if (typeof window === 'undefined') return [];
  try {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}
