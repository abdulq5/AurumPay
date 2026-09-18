const INDIA_LOCALE = 'en-IN';

export function formatMoney(value: number, minimumFractionDigits = 0) {
  return value.toLocaleString(INDIA_LOCALE, {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  });
}

export function formatGold(value: number) {
  return value.toFixed(4);
}

export function formatDate(value: string, fallback: string, includeTime = false) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return includeTime
    ? date.toLocaleString(INDIA_LOCALE, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : date.toLocaleDateString(INDIA_LOCALE, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
}

export function formatDateTimeParts(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    date: date.toLocaleDateString(INDIA_LOCALE, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString(INDIA_LOCALE, {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export function formatTime(value: string, fallback: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleTimeString(INDIA_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  });
}