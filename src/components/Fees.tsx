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
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { getPrettyFee } from '@helpers/getPrettyFee';
import { CREATE_VAULT_FEE, DELEGATION_FEE, FIN_TAKER_FEE, SWAP_FEE } from 'src/constants';
import useFiatPrice from '@hooks/useFiatPrice';

function FeeBreakdown({
  initialDenomName,
  swapAmount,
  price,
  applyPromo,
}: {
  initialDenomName: string;
  swapAmount: number;
  price: number;
  applyPromo: boolean;
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
          <Flex flexDirection="row" px={2} pb={4} mt={0} gap={3}>
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
                  {applyPromo ? (
                    <Text color="blue.200" textStyle="body-xs">
                      Free
                    </Text>
                  ) : (
                    <Text textStyle="body-xs">
                      {getPrettyFee(swapAmount, SWAP_FEE / 2)} {initialDenomName}
                    </Text>
                  )}
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">Kujira community pool:</Text>
                  <Spacer />
                  {applyPromo ? (
                    <Text color="blue.200" textStyle="body-xs">
                      Free
                    </Text>
                  ) : (
                    <Text textStyle="body-xs">
                      {getPrettyFee(swapAmount, SWAP_FEE / 2)} {initialDenomName}
                    </Text>
                  )}
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">Estimated gas:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">Free</Text>
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
                    {getPrettyFee(swapAmount, (applyPromo ? 0 : SWAP_FEE) + FIN_TAKER_FEE)} {initialDenomName}
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

export default function Fees({ formName }: { formName: FormNames }) {
  const { state } = useConfirmForm(formName);
  const { price } = useFiatPrice(state?.initialDenom);

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const { initialDenom, resultingDenom, swapAmount, autoStakeValidator } = state;

  const { name: initialDenomName, promotion: initialDenomPromotion } = getDenomInfo(initialDenom);
  const { promotion: resultingDenomPromotion } = getDenomInfo(resultingDenom);

  const applyPromo = Boolean(initialDenomPromotion) || Boolean(resultingDenomPromotion);

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs">
        Deposit fee{' '}
        <Text as="span" textColor="white">
          {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />} {initialDenomName}
        </Text>{' '}
        +{' '}
        <Text as="span" textColor="white">
          {String.fromCharCode(8275)} {getPrettyFee(swapAmount, SWAP_FEE + FIN_TAKER_FEE)} {initialDenomName}
        </Text>
        {autoStakeValidator && <Text as="span"> &amp; {DELEGATION_FEE * 100}% auto staking fee</Text>} per swap
      </Text>

      <FeeBreakdown initialDenomName={initialDenomName} swapAmount={swapAmount} price={price} applyPromo={applyPromo} />
    </Stack>
  );
}
