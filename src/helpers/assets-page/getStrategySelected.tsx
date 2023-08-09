import { FormNames } from "@hooks/useFormStore"
import { StrategyTypes } from "@models/StrategyTypes"


export function getStrategySelected(strategySelected: string) {

    if (strategySelected === StrategyTypes.DCAIn) {
        return FormNames.DcaIn
    }
    if (strategySelected === StrategyTypes.DCAPlusIn) {
        return FormNames.DcaPlusIn
    }
    if (strategySelected === StrategyTypes.WeightedScaleIn) {
        return FormNames.WeightedScaleIn
    }
    if (strategySelected === StrategyTypes.DCAOut) {
        return FormNames.DcaOut
    }
    if (strategySelected === StrategyTypes.DCAPlusOut) {
        return FormNames.DcaPlusOut
    }
    return FormNames.WeightedScaleOut

}