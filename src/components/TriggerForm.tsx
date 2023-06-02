import { Box } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { StartImmediatelyValues } from '@models/StartImmediatelyValues';
import StartDate from '@components/StartDate';
import StartImmediately from '@components/StartImmediately';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { FormNames } from '@hooks/useFormStore';
import PurchaseTime from './PurchaseTime';
import StartPrice from './StartPrice';
import { TransactionType } from './TransactionType';
import { CollapseWithRender } from './CollapseWithRender';

export function TriggerForm({ transactionType, formName }: { transactionType: TransactionType; formName: FormNames }) {
  const { values } = useFormikContext<DcaInFormDataAll>();
  const { startImmediately, triggerType, advancedSettings } = values;

  return (
    <Box>
      <StartImmediately />
      <CollapseWithRender isOpen={startImmediately === StartImmediatelyValues.No}>
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
          <StartPrice formName={formName} transactionType={transactionType} />
        </CollapseWithRender>
      </CollapseWithRender>
    </Box>
  );
}
