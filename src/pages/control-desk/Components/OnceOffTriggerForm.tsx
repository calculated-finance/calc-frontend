import { Box } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import StartDate from '@components/StartDate';
import StartImmediately from '@components/StartImmediately';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { DenomInfo } from '@utils/DenomInfo';
import YesNoValues from '@models/YesNoValues';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { CtrlFormDataAll } from '../ControlDeskForms';
import { CollapseWithRender } from '@components/CollapseWithRender';
import PurchaseTime from '@components/PurchaseTime';
import { TransactionType } from '@components/TransactionType';
import StartPrice from '@components/StartPrice';
import { useControlDeskStrategyInfo } from '../useControlDeskStrategyInfo';

export function OnceOffTriggerForm({
  initialDenom,
  resultingDenom,
}: {
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
}) {
  const { values } = useFormikContext<CtrlFormDataAll>();
  // const { startImmediately, triggerType, advancedSettings } = values;
  const { advancedSettings } = values;
  const { transactionType } = useControlDeskStrategyInfo();

  return (
    <Box>
      <StartDate />
      <CollapseWithRender isOpen={advancedSettings}>
        <PurchaseTime
          title={transactionType === TransactionType.Buy ? 'Purchase time' : 'Sell time'}
          subtitle={
            transactionType === TransactionType.Buy
              ? 'This is the time of day that your first buy will be made'
              : undefined
          }
        />
      </CollapseWithRender>

    </Box>
  );
}
