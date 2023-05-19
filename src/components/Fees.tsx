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
import getDenomInfo from '@utils/getDenomInfo';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { getPrettyFee } from '@helpers/getPrettyFee';
import { CREATE_VAULT_FEE, DELEGATION_FEE } from 'src/constants';
import useFiatPrice from '@hooks/useFiatPrice';
import { FormNames } from '@hooks/useFormStore';
import { Chains, useChain } from '@hooks/useChain';
import useDexFee from '@hooks/useDexFee';
import { getChainDexName } from '@helpers/chains';
import { DcaFormState } from '@hooks/useCreateVault/DcaFormState';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { TransactionType } from './TransactionType';

function FeeBreakdown({
  initialDenomName,
  swapAmount,
  price,
  applyPromo,
  dexFee,
  swapFee,
}: {
  initialDenomName: string;
  swapAmount: number;
  price: number;
  applyPromo: boolean;
  dexFee: number;
  swapFee: number;
}) {
  const [isOpen, { toggle }] = useBoolean(false);
  const { chain } = useChain();

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
            <Flex flexGrow={1} flexDirection="column">
              <Heading size="xs">Once off</Heading>
              <Stack spacing={0}>
                <Flex>
                  <Text textStyle="body-xs">Transaction fees:</Text>
                  <Spacer />
                  <Text textStyle="body-xs" as="span">
                    {' '}
                    {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
                    {initialDenomName}
                  </Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" textColor="white">
                    Total fees and tax:
                  </Text>
                  <Spacer />
                  <Text textStyle="body-xs" textColor="white" as="span">
                    {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
                    {initialDenomName}
                  </Text>
                </Flex>
              </Stack>
            </Flex>
            <Flex flexGrow={1} flexDirection="column">
              <Heading size="xs">Per swap</Heading>
              <Stack spacing={0}>
                {chain === Chains.Osmosis && (
                  <Flex>
                    <Text textStyle="body-xs">CALC sustainability tax:</Text>
                    <Spacer />
                    {applyPromo ? (
                      <Text color="blue.200" textStyle="body-xs">
                        Free
                      </Text>
                    ) : (
                      <Text textStyle="body-xs">
                        {getPrettyFee(swapAmount, swapFee)} {initialDenomName}
                      </Text>
                    )}
                  </Flex>
                )}
                {chain === Chains.Kujira && (
                  <>
                    <Flex>
                      <Text textStyle="body-xs">CALC sustainability tax:</Text>
                      <Spacer />
                      {applyPromo ? (
                        <Text color="blue.200" textStyle="body-xs">
                          Free
                        </Text>
                      ) : (
                        <Text textStyle="body-xs">
                          {getPrettyFee(swapAmount, swapFee / 2)} {initialDenomName}
                        </Text>
                      )}
                    </Flex>
                    <Flex>
                      <Text textStyle="body-xs">{Chains[chain]} community pool:</Text>
                      <Spacer />
                      {applyPromo ? (
                        <Text color="blue.200" textStyle="body-xs">
                          Free
                        </Text>
                      ) : (
                        <Text textStyle="body-xs">
                          {getPrettyFee(swapAmount, swapFee / 2)} {initialDenomName}
                        </Text>
                      )}
                    </Flex>
                  </>
                )}
                <Flex>
                  <Text textStyle="body-xs">Estimated gas:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">Free</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">{getChainDexName(chain)} txn fees:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">
                    {getPrettyFee(swapAmount, dexFee)} {initialDenomName}
                  </Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" textColor="white">
                    Total fees per swap:
                  </Text>
                  <Spacer />
                  <Text textStyle="body-xs" textColor="white">
                    {getPrettyFee(swapAmount, (applyPromo ? 0 : swapFee) + dexFee)} {initialDenomName}
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
  state,
  transactionType,
  swapFee,
  swapFeeTooltip,
}: {
  state: DcaInFormDataAll | WeightedScaleState;
  transactionType: TransactionType;
  swapFee: number;
  swapFeeTooltip?: string;
}) {
  const { price } = useFiatPrice(state?.initialDenom);

  const { initialDenom, autoStakeValidator, swapAmount, resultingDenom } = state || {};

  const { dexFee } = useDexFee(initialDenom, resultingDenom, transactionType);

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const { name: initialDenomName, promotion: initialDenomPromotion } = getDenomInfo(initialDenom);
  const { promotion: resultingDenomPromotion } = getDenomInfo(resultingDenom);

  const applyPromo = Boolean(initialDenomPromotion) || Boolean(resultingDenomPromotion);

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs" as="span">
        Deposit fee{' '}
        <Text as="span" textColor="white">
          {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />} {initialDenomName}
        </Text>{' '}
        +{' '}
        <Tooltip label={swapFeeTooltip} placement="top">
          <Text as="span" textColor="white">
            {String.fromCharCode(8275)} {getPrettyFee(swapAmount!, swapFee + dexFee)} {initialDenomName}
          </Text>
        </Tooltip>
        {autoStakeValidator && <Text as="span"> &amp; {DELEGATION_FEE * 100}% auto staking fee</Text>} per swap
      </Text>

      <FeeBreakdown
        initialDenomName={initialDenomName}
        swapAmount={swapAmount!}
        price={price}
        applyPromo={applyPromo}
        dexFee={dexFee}
        swapFee={swapFee}
      />
    </Stack>
  );
}
