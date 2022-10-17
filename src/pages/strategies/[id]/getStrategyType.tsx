
export function getStrategyType(position_type: string | undefined) {
  return position_type === 'enter' ? 'DCA In' : 'DCA Out';
}
