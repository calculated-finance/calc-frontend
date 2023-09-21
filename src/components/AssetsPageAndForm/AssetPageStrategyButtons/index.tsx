import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  UseRadioProps,
  VStack,
  useDisclosure,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { useRouter } from 'next/router';
import StrategyUrls from 'src/pages/create-strategy/StrategyUrls';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { LearningHubLinks } from 'src/pages/learn-about-calc/LearningHubLinks';
import LinkWithQuery from '../../LinkWithQuery';
import { BuySellButtons } from './BuySellButtons';

const buttonStyles = {
  cursor: 'pointer',
  borderWidth: '1px',
  borderRadius: 'lg',
  textColor: 'slategrey',
  borderColor: 'slategrey',
  _focus: {
    color: 'blue.200',
    borderColor: 'blue.200',
    opacity: '90%',
  },
  _hover: { bgColor: 'transparent' },
  fontSize: { base: 10, sm: 12 },
  width: { base: '108px', sm: 32 },
  variant: 'outline',
  size: 'xs',
};

const buttonLabels = {
  buttonLabelsIn: {
    path: ['dca-in', 'dca-plus-in', 'weighted-scale-in'],
    buttonText: ['DCA In', 'DCA+ In', 'Weighted Scale In'],
    buttonLinks: [StrategyUrls.DCAIn, StrategyUrls.DCAPlusIn, StrategyUrls.WeightedScaleIn],
  },
  buttonLabelsOut: {
    path: ['dca-out', 'dca-plus-out', 'weighted-scale-out'],
    buttonText: ['DCA Out', 'DCA+ Out', 'Weighted Scale Out'],
    buttonLinks: [StrategyUrls.DCAOut, StrategyUrls.DCAPlusOut, StrategyUrls.WeightedScaleOut],
  },
};

type RouterType = {
  pathname: string;
};

export function BuyStrategyInfoModal({ isOpen, onClose }: Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buy Strategies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            px={8}
            py={4}
            bg="abyss.200"
            fontSize="sm"
            borderRadius="xl"
            borderWidth={1}
            borderColor="slateGrey"
            w="full"
          >
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Standard DCA In
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  Consistently swap the same amount on a time interval.
                </Text>
                <Link href={LearningHubLinks.Dca} fontSize={12} isExternal>
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Algorithm DCA+ In
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  DCA into large cap assets based on market risk.
                </Text>
                <Link href={LearningHubLinks.DcaPlus} fontSize={12} isExternal>
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Weighted Scale In
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  Buy more when the price is low, and less when the price is high.
                </Text>
                <Link href={LearningHubLinks.WeightedScale} fontSize={12} isExternal>
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
            </Stack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
export function SellStrategyInfoModal({ isOpen, onClose }: Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell Strategies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            px={8}
            py={4}
            bg="abyss.200"
            fontSize="sm"
            borderRadius="xl"
            borderWidth={1}
            borderColor="slateGrey"
            w="full"
          >
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Standard DCA Out
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  Consistently swap the same amount on a time interval.
                </Text>
                <Link href={LearningHubLinks.Dca} fontSize={12} isExternal>
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Algorithm DCA+ Out
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  DCA out of large cap assets based on market risk.
                </Text>
                <Link href={LearningHubLinks.DcaPlus} fontSize={12} isExternal>
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Weighted Scale Out
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  Sell more when the price is high, and less when the price is low.
                </Text>
                <Link href={LearningHubLinks.WeightedScale} fontSize={12} isExternal>
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
            </Stack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function CategoryRadioCard({
  buttonClicked,
  ...props
}: { buttonClicked: string } & UseRadioProps & ChildrenProp) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const { isOpen: isBuyOpen, onOpen: onBuyOpen, onClose: onBuyClose } = useDisclosure();
  const { isOpen: isSellOpen, onOpen: onSellOpen, onClose: onSellClose } = useDisclosure();

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderBottomWidth="1px"
        borderRadius={0}
        color="slategrey"
        _checked={{
          color: 'blue.200',
          borderBottomColor: 'blue.200',
          opacity: '90%',
        }}
        opacity="90%"
        fontSize={14}
        fontWeight="bold"
        textAlign="center"
        px={1}
        py={1}
        w={{ base: 40, sm: 44 }}
        justifyContent="center"
      >
        <Center>
          <HStack>
            <Box> {props.children}</Box>
            <Button
              variant="link"
              size="xs"
              color="slategrey"
              onClick={props.value?.includes('Buy') ? onBuyOpen : onSellOpen}
            >
              <Icon as={QuestionOutlineIcon} _hover={{ color: 'blue.200' }} />
            </Button>
          </HStack>
        </Center>
      </Box>
      <BuyStrategyInfoModal isOpen={isBuyOpen} onClose={onBuyClose} />
      <SellStrategyInfoModal isOpen={isSellOpen} onClose={onSellClose} />
    </Box>
  );
}

export function BuyButtons({ pathname }: RouterType) {
  return (
    <ButtonGroup>
      {buttonLabels.buttonLabelsIn.path.map((el, index) => {
        if (pathname.includes(el)) {
          return (
            <Button {...buttonStyles} color="blue.200" borderColor="blue.200" opacity="90%" key={el} data-testid={el}>
              {buttonLabels.buttonLabelsIn.buttonText[index]}
            </Button>
          );
        }
        return (
          <LinkWithQuery href={buttonLabels.buttonLabelsIn.buttonLinks[index]} key={el} passHref>
            <Button {...buttonStyles} data-testid={el} key={el}>
              {buttonLabels.buttonLabelsIn.buttonText[index]}
            </Button>
          </LinkWithQuery>
        );
      })}
    </ButtonGroup>
  );
}
export function SellButtons({ pathname }: RouterType) {
  return (
    <ButtonGroup data-testid="sell-buttons">
      {buttonLabels.buttonLabelsOut.path.map((el, index) => {
        if (pathname.includes(el)) {
          return (
            <Button {...buttonStyles} color="blue.200" borderColor="blue.200" opacity="90%" key={el} data-testid={el}>
              {buttonLabels.buttonLabelsOut.buttonText[index]}
            </Button>
          );
        }
        return (
          <LinkWithQuery href={buttonLabels.buttonLabelsOut.buttonLinks[index]} key={el} passHref>
            <Button {...buttonStyles} data-testid={el} key={el}>
              {buttonLabels.buttonLabelsOut.buttonText[index]}
            </Button>
          </LinkWithQuery>
        );
      })}
    </ButtonGroup>
  );
}

export function AssetPageStrategyButtons() {
  const router = useRouter();
  const { pathname } = router;
  const buttonOptions = ['Buy strategies', 'Sell strategies'];
  const currentStrategyCategory = useStrategyInfo();
  const initialButtonSelected =
    currentStrategyCategory?.transactionType === 'buy' ? BuySellButtons.Buy : BuySellButtons.Sell;
  const [buttonClicked, setButtonClicked] = useState(initialButtonSelected);
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: initialButtonSelected,
    onChange: (nextValue: BuySellButtons) => setButtonClicked(nextValue),
  });
  const categoryGroup = getRootProps();
  return (
    <VStack spacing={4} pb={6}>
      <HStack {...categoryGroup} spacing={{ base: 4, sm: 8 }}>
        {buttonOptions.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <CategoryRadioCard key={value} {...radio} buttonClicked={buttonClicked}>
              {value}
            </CategoryRadioCard>
          );
        })}
      </HStack>
      {buttonClicked.includes(BuySellButtons.Buy) ? (
        <BuyButtons pathname={pathname} />
      ) : (
        <SellButtons pathname={pathname} />
      )}
    </VStack>
  );
}
