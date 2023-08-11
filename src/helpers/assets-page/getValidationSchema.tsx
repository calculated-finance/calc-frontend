import { step1ValidationSchema } from "@models/DcaInFormData"
import { StrategyTypes } from "@models/StrategyTypes"
import { DcaPlusAssetsFormSchema } from "@models/dcaPlusFormData"
import { WeightedScaleAssetsFormSchema } from "@models/weightedScaleFormData"

export function getValidationSchema(strategySelected: StrategyTypes) {

    if (strategySelected === (StrategyTypes.DCAIn || StrategyTypes.DCAOut)) {
        return step1ValidationSchema
    }
    if (strategySelected === (StrategyTypes.DCAPlusIn || StrategyTypes.DCAPlusOut)) {
        return DcaPlusAssetsFormSchema
    }
    return WeightedScaleAssetsFormSchema
}