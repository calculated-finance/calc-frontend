export function generateStrategyDetailUrl(id: string | string[] | undefined) {
  return { pathname: '/strategies/details', query: { id } };
}
