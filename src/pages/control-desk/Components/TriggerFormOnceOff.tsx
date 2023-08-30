import { Box } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { CollapseWithRender } from '@components/CollapseWithRender';
import PurchaseTime from '@components/PurchaseTime';
import { CtrlFormDataAll } from '../ControlDeskForms';
import StartDateOnceOff from './StartDateOnceOff';

export function TriggerFormOnceOff() {
  const { values } = useFormikContext<CtrlFormDataAll>();
  const { advancedSettings } = values;

  return (
    <Box>
      <StartDateOnceOff />
      <CollapseWithRender isOpen={advancedSettings}>
        <PurchaseTime
          title=''
          subtitle={undefined}
        />
      </CollapseWithRender>

    </Box>
  );
}
