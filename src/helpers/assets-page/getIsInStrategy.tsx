import { StrategyTypes } from "@models/StrategyTypes";

export function getIsInStrategy(strategyType: string | undefined) {
    if (strategyType === StrategyTypes.DCAIn) {
        return true;
    }
    if (strategyType === StrategyTypes.DCAPlusIn) {
        return true
    }

    if (strategyType === StrategyTypes.WeightedScaleIn) {
        return true
    }

    return false;
}