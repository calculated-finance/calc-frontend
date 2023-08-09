import steps from "@formConfig/dcaIn"
import dcaOutSteps from "@formConfig/dcaOut"
import { dcaPlusInSteps } from "@formConfig/dcaPlusIn"
import dcaPlusOutSteps from "@formConfig/dcaPlusOut"
import { weightedScaleInSteps } from "@formConfig/weightedScaleIn"
import weightedScaleOutSteps from "@formConfig/weightedScaleOut"
import { StrategyTypes } from "@models/StrategyTypes"


export function getSteps(strategySelected: string | undefined) {
    if (strategySelected === StrategyTypes.DCAIn) {
        return steps
    }
    if (strategySelected === StrategyTypes.DCAPlusIn) {
        return dcaPlusInSteps
    }
    if (strategySelected === StrategyTypes.WeightedScaleIn) {
        return weightedScaleInSteps
    }
    if (strategySelected === StrategyTypes.DCAOut) {
        return dcaOutSteps
    }
    if (strategySelected === StrategyTypes.DCAPlusOut) {
        return dcaPlusOutSteps
    }
    return weightedScaleOutSteps
}