import { Strategy } from "@hooks/useStrategies";

export function getSlippageTolerance(strategy: Strategy) {
    return strategy.slippage_tolerance? `${(parseFloat(strategy.slippage_tolerance) * 100).toFixed(2)}%` : "-"
}