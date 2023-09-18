import { Box } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { DenomInfo } from '@utils/DenomInfo';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { CtrlFormDataAll } from './ControlDeskForms';
import EndDate from './EndDateOnceOff';
import EndTime from './EndTimeOnceOff';

export function TriggerFormOnceOff({ resultingDenom }: { resultingDenom: DenomInfo }) {
  const { values } = useFormikContext<CtrlFormDataAll>();
  const { advancedSettings } = values;

  return (
    <Box>
      <EndDate resultingDenom={resultingDenom} />
      <CollapseWithRender isOpen={advancedSettings}>
        <EndTime
          title=''
          subtitle={undefined}
        />
      </CollapseWithRender>

    </Box>
  );
}
