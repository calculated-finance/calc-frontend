import { Box } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import StartDate from '@components/StartDate';
import StartImmediately from '@components/StartImmediately';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { DenomInfo } from '@utils/DenomInfo';
import PurchaseTime from './PurchaseTime';
import StartPrice from './StartPrice';
import { TransactionType } from './TransactionType';
import { CollapseWithRender } from './CollapseWithRender';
import YesNoValues from '@models/YesNoValues';

export function TriggerForm({
  transactionType,
  initialDenom,
  resultingDenom,
}: {
  transactionType: TransactionType;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
}) {
  const { values } = useFormikContext<DcaInFormDataAll>();
  const { startImmediately, triggerType, advancedSettings } = values;

  return (
    <Box>
      <StartImmediately />
      <CollapseWithRender isOpen={startImmediately === YesNoValues.No}>
        <CollapseWithRender isOpen={triggerType === 'date'}>
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
        </CollapseWithRender>
        <CollapseWithRender isOpen={triggerType === 'price'}>
          <StartPrice transactionType={transactionType} initialDenom={initialDenom} resultingDenom={resultingDenom} />
        </CollapseWithRender>
      </CollapseWithRender>
    </Box>
  );
}
