export function generateStrategyTopUpUrl(id: string | undefined) {
  return { pathname: '/strategies/top-up/', query: { id } };
}
