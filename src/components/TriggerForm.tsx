import { Box, Collapse } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { StartImmediatelyValues } from '@models/StartImmediatelyValues';
import StartDate from '@components/StartDate';
import StartImmediately from '@components/StartImmediately';
import { DcaFormState } from '@hooks/useCreateVault/DcaFormState';
import { FormNames } from '@hooks/useDcaInForm';
import PurchaseTime from './PurchaseTime';
import StartPrice from './DcaInStartPrice';
import { TransactionType } from './TransactionType';

export function TriggerForm({ transactionType, formName }: { transactionType: TransactionType; formName: FormNames }) {
  const { values } = useFormikContext<DcaFormState>();
  const { startImmediately, triggerType, advancedSettings } = values;

  return (
    <Box>
      <StartImmediately />
      <Collapse in={startImmediately === StartImmediatelyValues.No}>
        <Collapse animateOpacity in={triggerType === 'date'}>
          <Box m="px">
            <StartDate />
            <Collapse in={advancedSettings}>
              <Box m="px">
                <PurchaseTime
                  title={transactionType === TransactionType.Buy ? 'Purchase time' : 'Sell time'}
                  subtitle={
                    transactionType === TransactionType.Buy
                      ? 'This is the time of day that your first buy will be made'
                      : undefined
                  }
                />
              </Box>
            </Collapse>
          </Box>
        </Collapse>
        <Collapse animateOpacity in={triggerType === 'price'}>
          <Box m="px">
            <StartPrice formName={formName} />
          </Box>
        </Collapse>
      </Collapse>
    </Box>
  );
}
