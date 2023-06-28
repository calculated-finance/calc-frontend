import { DcaInFormDataAll } from '@models/DcaInFormData';
import { TransactionType } from '@components/TransactionType';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { FormNames } from '@hooks/useFormStore';
import { Chains } from '@hooks/useChain/Chains';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { isNil } from 'lodash';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import { buildCreateVaultParamsDCA } from './buildCreateVaultParamsDCA';
import { buildCreateVaultParamsWeightedScale } from './buildCreateVaultParamsWeightedScale';
import { buildCreateVaultParamsDCAPlus } from './buildCreateVaultParamsDCAPlus';
import { DcaFormState } from '../DcaFormState';

export function getCreateVaultMsgForStrategyType(
  formType: FormNames,
  state: DcaFormState,
  transactionType: TransactionType,
  senderAddress: string,
  currentPrice: number | undefined,
  chain: Chains,
  config: Config,
) {
  if (formType === FormNames.DcaIn || formType === FormNames.DcaOut) {
    return buildCreateVaultParamsDCA(state as DcaInFormDataAll, transactionType, senderAddress, chain);
  }

  if (formType === FormNames.DcaPlusIn || formType === FormNames.DcaPlusOut) {
    return buildCreateVaultParamsDCAPlus(state as DcaPlusState, transactionType, senderAddress, chain, config);
  }

  if (formType === FormNames.WeightedScaleIn || formType === FormNames.WeightedScaleOut) {
    if (isNil((state as WeightedScaleState).basePriceValue) && isNil(currentPrice)) {
      throw new Error('Current price has not loaded yet. Please try again');
    }
    return buildCreateVaultParamsWeightedScale(
      state as WeightedScaleState,
      transactionType,
      senderAddress,
      Number(currentPrice),
      chain,
    );
  }

  throw new Error('Invalid form type');
}
