import useFiatPrice from "@hooks/useFiatPrice";
import { DenomInfo } from "@utils/DenomInfo";
import { Spinner, Stack, Text, Tooltip } from "@chakra-ui/react";
import { CREATE_VAULT_FEE, DELEGATION_FEE } from "src/constants";
import { getPrettyFee } from "@helpers/getPrettyFee";
import { FeeBreakdown } from "@components/Fees";
import useDexFee from "@hooks/useDexFee";
import { useControlDeskStrategyInfo } from "../useControlDeskStrategyInfo";

export default function FeesControlDesk({
  swapFee,
  initialDenom,
  resultingDenom,
  swapAmount,
  autoStakeValidator,
  swapFeeTooltip,
  excludeDepositFee = false,
}: {
  swapFee: number;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  swapAmount: number;
  autoStakeValidator: string | null | undefined;
  swapFeeTooltip?: string;
  excludeDepositFee?: boolean;
}) {
  const { price } = useFiatPrice(initialDenom);

  const { transactionType } = useControlDeskStrategyInfo();

  const { dexFee } = useDexFee(initialDenom, resultingDenom, transactionType);

  const { name: initialDenomName } = initialDenom;

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs" as="span">
        {!excludeDepositFee ? (
          <>
            Deposit fee{' '}
            <Text as="span" textColor="white">
              {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />} {initialDenomName}
            </Text>{' '}
            +{' '}
          </>
        ) : (
          <>Fees: </>
        )}
        <Tooltip label={swapFeeTooltip} placement="top">
          <Text as="span" textColor="white">
            {String.fromCharCode(8275)} {getPrettyFee(swapAmount, swapFee + dexFee)} {initialDenomName}
          </Text>
        </Tooltip>
        {autoStakeValidator && <Text as="span"> &amp; {DELEGATION_FEE * 100}% auto staking fee</Text>} per swap
      </Text>

      <FeeBreakdown
        initialDenomName={initialDenomName}
        swapAmount={swapAmount}
        price={price}
        dexFee={dexFee}
        swapFee={swapFee}
        excludeDepositFee={excludeDepositFee}
      />
    </Stack>
  );
}
