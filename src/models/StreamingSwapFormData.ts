import getDenomInfo from '@utils/getDenomInfo';
import * as Yup from 'yup';
import { Coin } from 'src/interfaces/generated-osmosis/response/get_vault';
import YesNoValues from './YesNoValues';

export const initialValues = {
  resultingDenom: '',
  initialDenom: '',
  initialDeposit: undefined,
  strategyDuration: 600,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: undefined,
};

export const schema = Yup.object({
  resultingDenom: Yup.string().label('Resulting Denom').required(),
  initialDenom: Yup.string().label('Initial Denom').required(),
  initialDeposit: Yup.number()
    .label('Initial Deposit')
    .positive()
    .required()
    .nullable()
    .test({
      name: 'less-than-deposit',
      message: ({ label }) => `${label} must be less than or equal to than your current balance`,
      test(value, context) {
        const balances = context?.options?.context?.balances;
        if (!balances || !value || value <= 0) return true;
        const balance = balances.find((b: Coin) => b.denom === context.parent.initialDenom)?.amount;
        return balance && value <= getDenomInfo(context.parent.initialDenom).conversion(Number(balance));
      },
    }),
  strategyDuration: Yup.number(),
  priceThresholdValue: Yup.number()
    .nullable()
    .label('Price Threshold')
    .positive()
    .when(['advancedSettings', 'priceThresholdEnabled'], {
      is: (advancedSettings: boolean, priceThresholdEnabled: YesNoValues) =>
        advancedSettings === true && priceThresholdEnabled === YesNoValues.Yes,
      then: (s) => s.required(),
      otherwise: (s) => s.transform(() => null),
    }),
  priceThresholdEnabled: Yup.mixed<YesNoValues>()
    .oneOf(Object.values(YesNoValues))
    .required()
    .when('advancedSettings', {
      is: false,
      then: (s) => s.transform(() => YesNoValues.No),
    }),
});

export type FormData = Yup.InferType<typeof schema>;
