import {
  Box,
  Button,
  Collapse,
  Fade,
  Flex,
  Heading,
  Icon,
  Spacer,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useBoolean,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { getPrettyFee } from '@helpers/getPrettyFee';
import { CREATE_VAULT_FEE, DELEGATION_FEE } from 'src/constants';
import useFiatPrice from '@hooks/useFiatPrice';
import { useChainId } from '@hooks/useChainId';
import useDexFee from '@hooks/useDexFee';
import { getChainDexName } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { TransactionType } from './TransactionType';

export function FeeBreakdown({
  initialDenom,
  swapAmount,
  price,
  dexFee,
  swapFee,
  excludeDepositFee,
}: {
  initialDenom: DenomInfo;
  swapAmount: number;
  price: number | undefined;
  dexFee: number;
  swapFee: number;
  excludeDepositFee: boolean;
}) {
  const [isOpen, { toggle }] = useBoolean(false);
  const { chainId: chain } = useChainId();

  return (
    <Stack position="relative" spacing={1}>
      <Box position="relative" w="min-content" zIndex={10} ml={isOpen ? 4 : 0}>
        <Box position="absolute" w="full" h="full" bg="darkGrey" />
        <Button
          rightIcon={<Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />}
          variant={isOpen ? 'ghost' : 'link'}
          size="xs"
          onClick={toggle}
          w="min-content"
        >
          Fee Breakdown
        </Button>
      </Box>
      <Box>
        <Fade in={isOpen}>
          <Box
            position="absolute"
            top={3}
            w="full"
            h="calc(100% - 16px)"
            borderColor="slateGrey"
            borderWidth={1}
            borderRadius="md"
          />
        </Fade>

        <Collapse in={isOpen}>
          <Flex flexDirection="row" px={2} pb={4} mt={0} gap={3}>
            <Flex flexGrow={10} flexDirection="column">
              <Heading size="xs">Deposit fee</Heading>
              <Stack spacing={0}>
                <Flex>
                  <Text textStyle="body-xs">Transaction fees:</Text>
                  <Spacer />
                  {excludeDepositFee ? (
                    <Text textStyle="body-xs">Free</Text>
                  ) : (
                    <Text textStyle="body-xs" as="span">
                      {' '}
                      {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
                      {initialDenom.name}
                    </Text>
                  )}
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" color="abyss.200">
                    -
                  </Text>
                  <Spacer />
                  <Text textStyle="body-xs" color="abyss.200">
                    -
                  </Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" color="abyss.200">
                    -
                  </Text>
                  <Spacer />
                  <Text textStyle="body-xs" color="abyss.200">
                    -
                  </Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" textColor="white">
                    Total fees and tax:
                  </Text>
                  <Spacer />
                  {excludeDepositFee ? (
                    <Text textStyle="body-xs" textColor="white">
                      Free
                    </Text>
                  ) : (
                    <Text textStyle="body-xs" textColor="white" as="span">
                      {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
                      {initialDenom.name}
                    </Text>
                  )}
                </Flex>
              </Stack>
            </Flex>
            <Flex flexGrow={1} flexDirection="column">
              <Heading size="xs">Per swap</Heading>
              <Stack spacing={0}>
                <Flex>
                  <Text textStyle="body-xs">CALC sustainability tax:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">
                    {Number(getPrettyFee(swapAmount, swapFee).toFixed(initialDenom.significantFigures))}{' '}
                    {initialDenom.name}
                  </Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">Estimated gas:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">Free</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">{getChainDexName(chain)} txn fees:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">
                    {Number(getPrettyFee(swapAmount, dexFee).toFixed(initialDenom.significantFigures))}{' '}
                    {initialDenom.name}
                  </Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" textColor="white">
                    Total fees per swap:
                  </Text>
                  <Spacer />
                  <Text textStyle="body-xs" textColor="white">
                    {Number(getPrettyFee(swapAmount, swapFee + dexFee).toFixed(initialDenom.significantFigures))}{' '}
                    {initialDenom.name}
                  </Text>
                </Flex>
              </Stack>
            </Flex>
          </Flex>
        </Collapse>
      </Box>
    </Stack>
  );
}

export default function Fees({
  swapFee,
  initialDenom,
  resultingDenom,
  swapAmount,
  autoStakeValidator,
  swapFeeTooltip,
  excludeDepositFee = false,
  transactionType,
}: {
  swapFee: number;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  swapAmount: number;
  autoStakeValidator: string | null | undefined;
  swapFeeTooltip?: string;
  excludeDepositFee?: boolean;
  transactionType: TransactionType;
}) {
  const { fiatPrice } = useFiatPrice(initialDenom);
  const { dexFee } = useDexFee(initialDenom, resultingDenom, transactionType);
  const { name: initialDenomName } = initialDenom;

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs" as="span">
        {!excludeDepositFee ? (
          <>
            Deposit fee{' '}
            <Text as="span" textColor="white">
              {fiatPrice ? parseFloat((CREATE_VAULT_FEE / fiatPrice).toFixed(3)) : <Spinner size="xs" />}{' '}
              {initialDenomName}
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
      <Box pl={2}>
        <FeeBreakdown
          initialDenom={initialDenom}
          swapAmount={swapAmount}
          price={fiatPrice}
          dexFee={dexFee}
          swapFee={swapFee}
          excludeDepositFee={excludeDepositFee}
        />
      </Box>
    </Stack>
  );
}
