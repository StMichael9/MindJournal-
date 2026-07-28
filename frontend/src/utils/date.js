export function parseApiDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const hasTimezone = /([zZ]|[+-]\d\d:\d\d)$/.test(value);
    return new Date(hasTimezone ? value : `${value}Z`);
  }

  return new Date(value);
}

export function formatApiDate(value, options) {
  const date = parseApiDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  });
}
