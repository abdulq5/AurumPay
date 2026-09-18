export type RouteParam = string | string[] | undefined;

export function getRouteParam(value: RouteParam) {
  return Array.isArray(value) ? value[0] : value;
}

export function getNumberRouteParam(value: RouteParam) {
  const parsed = Number(
    String(getRouteParam(value) ?? '0')
      .replace(/,/g, '')
      .replace(/₹/g, '')
      .trim(),
  );

  return Number.isFinite(parsed) ? parsed : 0;
}