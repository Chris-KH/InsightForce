const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

export function formatPercentFromRatio(value: number) {
  return percentFormatter.format(value);
}

export function formatPercentValue(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0s";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  if (mins === 0) {
    return `${secs}s`;
  }

  return `${mins}m ${secs}s`;
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
