import { StrategyTypes } from "@models/StrategyTypes";

export function getIsInStrategy(strategyType: string | undefined) {
    if (!strategyType) {
        return null
    }
    if ([StrategyTypes.DCAIn, StrategyTypes.DCAPlusIn, StrategyTypes.WeightedScaleIn].includes(strategyType as StrategyTypes)) {
        return true
    }

    return false;
}