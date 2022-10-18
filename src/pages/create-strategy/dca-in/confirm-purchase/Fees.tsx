import {
  Box,
  Button,
  Collapse,
  Divider,
  Fade,
  Flex,
  FormHelperText,
  Heading,
  Icon,
  Spacer,
  Spinner,
  Stack,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import totalExecutions from 'src/utils/totalExecutions';
import { useQuery } from '@tanstack/react-query';
import BadgeButton from '@components/BadgeButton';
import { ArrowDownIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { StartImmediatelyValues } from '../../../../models/StartImmediatelyValues';
import DcaInDiagram from './DcaInDiagram';
import executionIntervalDisplay from '../../../../helpers/executionIntervalDisplay';
import TriggerTypes from '../../../../models/TriggerTypes';
import AutoStakeValues from '../../../../models/AutoStakeValues';

function FeeBreakdown({ initialDenomName }: { initialDenomName: string }) {
  const [isOpen, { toggle }] = useBoolean(false);
  return (
    <Stack position="relative" spacing={1}>
      <Box position="relative" w="min-content" zIndex={10} pl={isOpen ? 2 : 0}>
        <Box position="absolute" w="full" h="full" bg="darkGrey" />
        <Button
          rightIcon={<Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />}
          variant="ghost"
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
          <Flex flexDirection="row" px={2} pb={2} mt={0} gap={6}>
            <Flex flexGrow={1} flexDirection="column">
              <Heading size="xs" color="blue.200">
                Once off
              </Heading>
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
              <Heading size="xs" color="blue.200">
                Per swap
              </Heading>
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

export default function Fees() {
  const { state } = useConfirmForm();

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const { initialDenom, resultingDenom, initialDeposit, swapAmount } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs">
        Deposit fee{' '}
        <Text as="span" textColor="white">
          {initialDeposit * 0.02}
          {initialDenomName}
        </Text>
        +{' '}
        <Text as="span" textColor="white">
          ~{swapAmount * 0.01}
        </Text>{' '}
        per swap
      </Text>
      <FeeBreakdown initialDenomName={initialDenomName} />
    </Stack>
  );
}
