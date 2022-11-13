export function getPriceCeilingFloor(swapAmount: string, receiveAmount: string) {
    return parseFloat(
        (parseFloat(swapAmount)/parseFloat(receiveAmount)).toFixed(3)
    )
}