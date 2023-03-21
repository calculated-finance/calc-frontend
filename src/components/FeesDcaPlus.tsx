import {
  Box,
  Button,
  Collapse,
  Divider,
  Fade,
  Flex,
  Heading,
  Icon,
  Spacer,
  Spinner,
  Stack,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { FormNames } from 'src/hooks/useDcaInForm';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { getPrettyFee } from '@helpers/getPrettyFee';
import useFiatPrice from '@hooks/useFiatPrice';
import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { getSwapAmountFromDuration } from 'src/helpers/getSwapAmountFromDuration';
import { CREATE_VAULT_FEE, FIN_TAKER_FEE, DELEGATION_FEE } from 'src/constants';

function FeeBreakdown({
  initialDenomName,
  swapAmount,
  price,
}: {
  initialDenomName: string;
  swapAmount: number;
  price: number;
}) {
  const [isOpen, { toggle }] = useBoolean(false);
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
          <Stack direction="column" px={2} pb={4}>
            <Flex flexDirection="row" mt={0} gap={3}>
              <Flex flexGrow={1} flexDirection="column">
                <Heading size="xs">Once off</Heading>
                <Stack spacing={0}>
                  <Flex>
                    <Text textStyle="body-xs">Transaction fees:</Text>
                    <Spacer />
                    <Text textStyle="body-xs">
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
                    <Text textStyle="body-xs" textColor="white">
                      {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
                      {initialDenomName}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
              <Flex flexGrow={1} flexDirection="column">
                <Heading size="xs">Per swap</Heading>
                <Stack spacing={0}>
                  <Flex>
                    <Text textStyle="body-xs">CALC sustainability tax:</Text>
                    <Spacer />
                    <Text textStyle="body-xs">FREE</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs">Estimated gas:</Text>
                    <Spacer />
                    <Text textStyle="body-xs">FREE</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs">FIN transaction fees:</Text>
                    <Spacer />
                    <Text textStyle="body-xs">
                      {getPrettyFee(swapAmount, FIN_TAKER_FEE)} {initialDenomName}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs" textColor="white">
                      Total fees per swap:
                    </Text>
                    <Spacer />
                    <Text textStyle="body-xs" textColor="white">
                      {getPrettyFee(swapAmount, FIN_TAKER_FEE)} {initialDenomName}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
            </Flex>
            <Divider />
            <Stack>
              <Text fontSize="xs" color="green.200">
                A performance fee is charged ONLY in the case that DCA+ outperforms traditional DCA and only on the
                difference in assets acquired.
              </Text>
              <Flex flexGrow={1} flexDirection="column">
                <Heading size="xs">Performance fee</Heading>
                <Stack spacing={0}>
                  <Flex>
                    <Text textStyle="body-xs">Base fee</Text>
                    <Spacer />
                    <Text textStyle="body-xs">FREE FOREVER</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs">Escrow</Text>
                    <Spacer />
                    <Text textStyle="body-xs">5% of swaps, returned in full if DCA+ underperforms.</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs" textColor="white">
                      Total possible fee:
                    </Text>
                    <Spacer />
                    <Text textStyle="body-xs" textColor="white">
                      1/5 of additional positive returns
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Collapse>
      </Box>
    </Stack>
  );
}

export default function FeesDcaPlus({ formName }: { formName: FormNames }) {
  const { state } = useDcaPlusConfirmForm(formName);
  const { price } = useFiatPrice(state?.initialDenom);

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const { initialDenom, resultingDenom, autoStakeValidator, initialDeposit, strategyDuration } = state;

  const swapAmount = getSwapAmountFromDuration(initialDeposit, strategyDuration);

  const { name: initialDenomName, promotion: initialDenomPromotion } = getDenomInfo(initialDenom);
  const { promotion: resultingDenomPromotion } = getDenomInfo(resultingDenom);

  const applyPromo = Boolean(initialDenomPromotion) || Boolean(resultingDenomPromotion);

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs">
        Transaction fee{' '}
        <Text as="span" textColor="white">
          {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />} {initialDenomName}
        </Text>{' '}
        +{' '}
        <Text as="span" textColor="white">
          ~{getPrettyFee(swapAmount, FIN_TAKER_FEE)} {initialDenomName}
        </Text>
        {autoStakeValidator && <Text as="span"> &amp; {DELEGATION_FEE * 100}% auto staking fee</Text>} per swap +
        performance fee
      </Text>

      <FeeBreakdown initialDenomName={initialDenomName} swapAmount={swapAmount} price={price} />
    </Stack>
  );
}
