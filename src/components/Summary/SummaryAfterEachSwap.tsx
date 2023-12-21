import { Box, Code, Spinner, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import useValidator from '@hooks/useValidator';
import useStrategy from '@hooks/useStrategy';
import { getStrategyExecutionInterval, getStrategyResultingDenom, getStrategyType } from '@helpers/strategy';
import { DcaFormState } from '@hooks/useCreateVault/DcaFormState';
import useDenoms from '@hooks/useDenoms';

function ReinvestSummary({ reinvestStrategy }: { reinvestStrategy: string }) {
  const { data: strategy, isLoading } = useStrategy(reinvestStrategy);
  if (isLoading) {
    return <Spinner size="xs" />;
  }
  if (!strategy) {
    return null;
  }

  return (
    <>
      After each swap, CALC will automatically reinvest those tokens into your{' '}
      <BadgeButton url="post-purchase">
        <Text>
          {getStrategyExecutionInterval(strategy)} {getStrategyResultingDenom(strategy).name}{' '}
          {getStrategyType(strategy)} strategy
        </Text>
        <Code bg="abyss.200" fontSize="xx-small">
          id: {strategy.id}
        </Code>
      </BadgeButton>
    </>
  );
}

export function SummaryAfterEachSwap({ state }: { state: DcaFormState }) {
  const { getDenomById } = useDenoms();

  const {
    resultingDenom,
    autoStakeValidator,
    autoCompoundStakingRewards,
    recipientAccount,
    yieldOption,
    reinvestStrategy,
  } = state;

  const { validator, isLoading } = useValidator(autoStakeValidator);

  return (
    <Box>
      <Text textStyle="body-xs">After each swap</Text>
      <Text lineHeight={8}>
        {!autoStakeValidator && !recipientAccount && !yieldOption && !reinvestStrategy && resultingDenom && (
          <>
            After each swap, CALC will send{' '}
            <BadgeButton url="assets">
              <Text>{resultingDenom.name}</Text>
              <DenomIcon denomInfo={resultingDenom} />
            </BadgeButton>{' '}
            to{' '}
            <BadgeButton url="post-purchase">
              <Text>your wallet</Text>
            </BadgeButton>
          </>
        )}
        {autoStakeValidator && (
          <>
            After each swap, CALC will automatically stake your tokens with:{' '}
            {isLoading ? (
              <Spinner size="xs" />
            ) : (
              <BadgeButton url="post-purchase">
                <Text>{validator && validator.description?.moniker}</Text>
              </BadgeButton>
            )}
            {autoCompoundStakingRewards && <>. Yieldmos will auto-compound your staking rewards.</>}
          </>
        )}
        {recipientAccount && (
          <>
            After each swap, CALC will send the funds to{' '}
            <BadgeButton url="post-purchase">
              <Text>{recipientAccount}</Text>
            </BadgeButton>
          </>
        )}
        {yieldOption === 'mars' && (
          <>
            After each swap, CALC will automatically deposit your tokens into{' '}
            <BadgeButton url="post-purchase">
              <Text>Mars Lend</Text>
            </BadgeButton>
          </>
        )}
        {reinvestStrategy && <ReinvestSummary reinvestStrategy={reinvestStrategy} />}
      </Text>
    </Box>
  );
}
