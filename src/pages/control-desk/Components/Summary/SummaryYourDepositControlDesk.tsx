import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { useDenom } from '@hooks/useDenom/useDenom';
import { CtrlFormDataAll } from '../ControlDeskForms';
import { useControlDeskStrategyInfo } from '../../useControlDeskStrategyInfo';

export function SummaryYourDepositControlDesk({ state }: { state: CtrlFormDataAll; }) {
  const { initialDenom: initialDenomId, targetAmount } = state;

  const initialDenom = useDenom(initialDenomId);

  const { strategyType } = useControlDeskStrategyInfo();

  return (
    <Box data-testid="summary-your-deposit">
      <Text textStyle="body-xs">Your deposit</Text>
      <Text lineHeight={8}>
        I deposit{' '}
        <BadgeButton url="assets">
          <Text>
            XXXXXXX {initialDenom.name}
          </Text>
          <DenomIcon denomInfo={initialDenom} />{' '}
        </BadgeButton>{' '}
        Into the CALC DCA Out vault.
      </Text>
    </Box>
  );
}
