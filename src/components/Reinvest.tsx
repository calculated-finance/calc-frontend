import {
  Box,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Stack,
  Text,
  UseRadioProps,
  useRadio,
  useRadioGroup,
  Center,
  HStack,
  IconButton,
  ModalProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Button,
  Link,
  Code,
  Image,
  Tooltip,
} from '@chakra-ui/react';
import { useField } from 'formik';
import {
  getStrategyExecutionInterval,
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyType,
  isStrategyCancelled,
} from '@helpers/strategy';
import Icon from '@components/Icon';
import { ArrowRightIcon, BoxedExportIcon } from '@fusion-icons/react/interface';
import { isEmpty } from 'lodash';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { DenomInfo } from '@utils/DenomInfo';
import { useStrategies } from '@hooks/useStrategies';
import { Strategy } from '@models/Strategy';
import Spinner from './Spinner';
import DenomIcon from './DenomIcon';
import { StrategyStatusBadge } from './StrategyStatusBadge';
import { ReinvestStrategyDetails } from './ReinvestStrategyDetails';

export function StrategyModal({ strategy, isOpen, onClose }: { strategy: Strategy } & Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Strategy details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack justify="center" gap={6} align="center">
            <ReinvestStrategyDetails strategy={strategy} />
            <Link isExternal href={`/strategies/details/?id=${strategy.id}`}>
              <Button variant="outline" rightIcon={<Icon as={BoxedExportIcon} stroke="brand.200" fontSize="md" />}>
                More details
              </Button>
            </Link>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function LoopingDiagram() {
  return (
    <Box pb={4}>
      <Image src="/images/reinvest-diagram-lite.svg" alt="reinvest-diagram" />
      <Text px={4}>
        For example, you can set price floors and ceilings and set up automated strategies that buy low and sell high.
      </Text>
    </Box>
  );
}

function StrategyOption(props: UseRadioProps & FlexProps & { strategy: Strategy }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);
  const { strategy } = props;

  const input = getInputProps();
  const checkbox = getRadioProps();

  // useDisclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex align="center" justify="space-between" gap={3} w="full">
      <Box as="label" {...htmlProps} w="full">
        <input {...input} />
        <Box
          {...checkbox}
          borderWidth={1}
          py={4}
          px={4}
          borderRadius="2xl"
          w="full"
          _hover={{ borderColor: 'grey', cursor: 'pointer' }}
          _checked={{
            borderColor: 'brand.200',
          }}
          _focusVisible={{
            boxShadow: 'outline',
          }}
        >
          <Box {...getLabelProps()}>
            <Flex justify="space-between" align="center" gap={4} fontSize="xs">
              <HStack spacing={1}>
                <DenomIcon showTooltip denomInfo={getStrategyInitialDenom(strategy)} />
                <Icon as={ArrowRightIcon} stroke="grey" />
                <DenomIcon showTooltip denomInfo={getStrategyResultingDenom(strategy)} />
              </HStack>
              <HStack flexGrow={1} align="center">
                <Text>
                  {getStrategyType(strategy)} - {getStrategyExecutionInterval(strategy)}{' '}
                </Text>
              </HStack>

              <HStack spacing={2}>
                <HStack spacing={1}>
                  <StrategyStatusBadge strategy={strategy} />
                  <Code bg="abyss.200" fontSize="xx-small" whiteSpace="nowrap">
                    id: {strategy.id}
                  </Code>
                </HStack>
                <IconButton
                  colorScheme="blue"
                  icon={<InfoOutlineIcon />}
                  aria-label="More details"
                  variant="ghost"
                  onClick={onOpen}
                />
              </HStack>
            </Flex>
          </Box>
        </Box>
      </Box>

      <StrategyModal strategy={strategy} isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export function Reinvest({ resultingDenom }: { resultingDenom: DenomInfo }) {
  const [field, meta, helpers] = useField({ name: 'reinvestStrategy' });
  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  const { data, isLoading } = useStrategies();

  const filteredStrategies = data
    ?.sort((a, b) => Number(b.id) - Number(a.id))
    .filter((strategy: Strategy) => {
      if (getStrategyInitialDenom(strategy).id !== resultingDenom.id) {
        return false;
      }

      if (isStrategyCancelled(strategy)) {
        return false;
      }
      return true;
    });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Want to link your strategies?</FormLabel>
      <FormHelperText>
        You can only link into strategies that have compatible assets.{' '}
        <Tooltip label={<LoopingDiagram />}>
          <InfoOutlineIcon color="blue.200" />
        </Tooltip>{' '}
      </FormHelperText>

      {!isEmpty(filteredStrategies) && (
        <>
          <FormLabel>Choose another CALC strategy</FormLabel>
          <FormHelperText pb={4}>
            You can choose from the below compatible strategies that you currently have. Cancelled strategies will not
            show up.
          </FormHelperText>
        </>
      )}
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : isEmpty(filteredStrategies) ? (
        <Stack>
          <Center p={6}>No suitable strategies available</Center>
          {isEmpty(filteredStrategies) && (
            <Image src="/images/reinvest-diagram-dark.svg" alt="reinvest-diagram" mb={4} borderRadius="md" />
          )}
        </Stack>
      ) : (
        <Stack {...getRootProps} maxH={220} overflow="auto">
          {filteredStrategies?.map((strategy: Strategy) => {
            const radio = getRadioProps({ value: strategy.id.toString() });
            return <StrategyOption key={strategy.id} {...radio} strategy={strategy} />;
          })}
        </Stack>
      )}
      <FormHelperText color="brand.200" fontSize="xs" bg="abyss.200" p={4} borderRadius="md" mt={4}>
        <HStack spacing={3}>
          <Image src="/images/lightBulbOutline.svg" alt="light bulb" />
          <Text>
            Don&apos;t worry, you can configure and link strategies later, on the &apos;view performance&apos; page.
          </Text>
        </HStack>
      </FormHelperText>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
