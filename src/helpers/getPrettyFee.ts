export function getPrettyFee(amountOfToken: number, fee: number) {
  return parseFloat((amountOfToken * fee).toFixed(3))
}
