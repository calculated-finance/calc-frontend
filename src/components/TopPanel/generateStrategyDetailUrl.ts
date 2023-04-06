export function generateStrategyDetailUrl(id: string | undefined) {
  return { pathname: '/strategies/details', query: { id } };
}
