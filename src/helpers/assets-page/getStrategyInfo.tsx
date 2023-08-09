import { StrategyTypes } from "@models/StrategyTypes"
import { TransactionType } from "@components/TransactionType"
import { FormNames } from "@hooks/useFormStore"
import { getStrategySelected } from "./getStrategySelected"


export function getStrategyInfo(strategySelected: string) {
    const strategyInfo = getStrategySelected(strategySelected)

    const allStrategyInfo = {
        dcaIn: {
            strategyInfo:
            {
                strategyType: StrategyTypes.DCAIn,
                transactionType: TransactionType.Buy,
                formName: FormNames.DcaIn
            }
        },
        dcaPlusIn: {
            strategyInfo:
            {
                strategyType: StrategyTypes.DCAPlusIn,
                transactionType: TransactionType.Buy,
                formName: FormNames.DcaPlusIn
            }
        },
        weightedScaleIn: {
            strategyInfo:
            {
                strategyType: StrategyTypes.WeightedScaleIn,
                transactionType: TransactionType.Buy,
                formName: FormNames.WeightedScaleIn
            }
        },
        dcaOut: {
            strategyInfo:
            {
                strategyType: StrategyTypes.DCAOut,
                transactionType: TransactionType.Sell,
                formName: FormNames.DcaOut
            }
        },
        dcaPlusOut: {
            strategyInfo:
            {
                strategyType: StrategyTypes.DCAPlusOut,
                transactionType: TransactionType.Sell,
                formName: FormNames.DcaPlusOut
            }
        },
        weightedScaleOut: {
            strategyInfo:
            {
                strategyType: StrategyTypes.WeightedScaleOut,
                transactionType: TransactionType.Sell,
                formName: FormNames.WeightedScaleOut
            }
        },

    }
    return allStrategyInfo[strategyInfo].strategyInfo
}