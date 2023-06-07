export function generateStrategyCustomiseUrl(id: string | undefined) {
  return { pathname: '/strategies/customise/', query: { id } };
}
