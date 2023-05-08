export function generateStrategyConfigureUrl(id: string | undefined) {
  return { pathname: '/strategies/configure/', query: { id } };
}
