import { Box, Button, Collapse, Fade, Flex, Heading, Icon, Spacer, Stack, Text, useBoolean } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { getPrettyFee } from 'src/helpers/getPrettyFee';

function FeeBreakdown({ initialDenomName }: { initialDenomName: string }) {
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
          <Flex flexDirection="row" px={2} pb={4} mt={0} gap={6}>
            <Flex flexGrow={1} flexDirection="column">
              <Heading size="xs">Once off</Heading>
              <Stack spacing={0}>
                <Flex>
                  <Text textStyle="body-xs">Gas:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">0.0 {initialDenomName}</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">Transaction fees:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">0.0 {initialDenomName}</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">Kado on-ramp fees:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">-</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" textColor="white">
                    Total fees and tax:
                  </Text>
                  <Spacer />
                  <Text textStyle="body-xs" textColor="white">
                    0.0 {initialDenomName}
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
                  <Text textStyle="body-xs">0.0 {initialDenomName}</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">Estimated gas:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">0.0 {initialDenomName}</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs">FIN transaction fees:</Text>
                  <Spacer />
                  <Text textStyle="body-xs">0.0 {initialDenomName}</Text>
                </Flex>
                <Flex>
                  <Text textStyle="body-xs" textColor="white">
                    Total fees per swap:
                  </Text>
                  <Spacer />
                  <Text textStyle="body-xs" textColor="white">
                    0.0 {initialDenomName}
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

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const { initialDenom, initialDeposit, swapAmount, autoStakeValidator } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs">
        Deposit fee{' '}
        <Text as="span" textColor="white">
          {getPrettyFee(initialDeposit, 0.001)} {initialDenomName}
        </Text>{' '}
        +{' '}
        <Text as="span" textColor="white">
          ~{getPrettyFee(swapAmount, 0.015)} {initialDenomName}
        </Text>{' '}
        per swap
        {autoStakeValidator && <Text as="span"> &amp; 1.5% auto staking fee</Text>}
      </Text>

      <FeeBreakdown initialDenomName={initialDenomName} />
    </Stack>
  );
}
