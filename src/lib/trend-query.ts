const FALLBACK_GENERAL_TREND_QUERY = "xu hướng mạng xã hội tổng quát hôm nay";

function normalizeQuery(value: string | undefined) {
  const normalized = value?.trim();

  if (!normalized || normalized.length < 2) {
    return undefined;
  }

  return normalized;
}

export function getDefaultGeneralTrendQuery() {
  return (
    normalizeQuery(import.meta.env.VITE_DEFAULT_GENERAL_TREND_QUERY) ??
    FALLBACK_GENERAL_TREND_QUERY
  );
}
