import { Box } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { CtrlFormDataAll } from './ControlDeskForms';
import EndDate from './EndDateOnceOff';
import EndTime from './EndTimeOnceOff';

export function TriggerFormOnceOff() {
  const { values } = useFormikContext<CtrlFormDataAll>();
  const { advancedSettings } = values;

  return (
    <Box>
      <EndDate />
      <CollapseWithRender isOpen={advancedSettings}>
        <EndTime
          title=''
          subtitle={undefined}
        />
      </CollapseWithRender>

    </Box>
  );
}
