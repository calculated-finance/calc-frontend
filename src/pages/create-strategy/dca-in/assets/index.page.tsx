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
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import useBalances from '@hooks/useBalances';
import DCAInResultingDenom from '@components/DCAInResultingDenom';
import DCAInInitialDenom from '@components/DCAInInitialDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { LearningHubLinks } from 'src/pages/learn-about-calc/index.page';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { StrategyInfoProvider } from '../customise/useStrategyInfo';
import { useRouter } from 'next/router';

function BuyStrategyInfoModal({ isOpen, onClose }: Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buy Strategies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex layerStyle="panel" p={8} alignItems="center" h="full">
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Standard DCA In
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  Consistently swap the same amount on a time interval.
                </Text>
                <Link href={LearningHubLinks.Dca} fontSize={12} target="_blank">
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
                <Link href={LearningHubLinks.DcaPlus} fontSize={12} target="_blank">
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
                <Link href={LearningHubLinks.WeightedScale} fontSize={12} target="_blank">
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
function SellStrategyInfoModal({ isOpen, onClose }: Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell Strategies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex layerStyle="panel" p={8} alignItems="center" h="full">
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Standard DCA Out
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  Consistently swap the same amount on a time interval.
                </Text>
                <Link href={LearningHubLinks.Dca} fontSize={12} target="_blank">
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Algorithm DCA+ Out
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  DCA into large cap assets based on market risk.
                </Text>
                <Link href={LearningHubLinks.DcaPlus} fontSize={12} target="_blank">
                  Read docs <ExternalLinkIcon />
                </Link>
              </Stack>
              <Stack spacing={1}>
                <Heading size="xs" fontWeight="bold">
                  Weighted Scale Out
                </Heading>
                <Text fontSize="sm" color="slategrey">
                  Buy more when the price is low, and less when the price is high.
                </Text>
                <Link href={LearningHubLinks.WeightedScale} fontSize={12} target="_blank">
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

function CategoryRadioCard({ buttonClicked, ...props }: { buttonClicked: string } & UseRadioProps & ChildrenProp) {
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
          color: 'brand.200',
          borderBottomColor: 'brand.200',
        }}
        fontSize={14}
        fontWeight="bold"
        textAlign="center"
        px={1}
        py={1}
        w={44}
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
              <Icon as={QuestionOutlineIcon} />
            </Button>
          </HStack>
        </Center>
      </Box>
      <BuyStrategyInfoModal isOpen={isBuyOpen} onClose={onBuyClose} />
      <SellStrategyInfoModal isOpen={isSellOpen} onClose={onSellClose} />
    </Box>
  );
}
const buttonStyles = {
  cursor: 'pointer',
  borderWidth: '1px',
  borderRadius: 'lg',
  textColor: 'slategrey',
  borderColor: 'slategrey',
  _focus: {
    color: 'brand.200',
    borderColor: 'brand.200',
  },
  _hover: { bgColor: 'transparent' },
  fontSize: 12,
  width: 32,
  variant: 'outline',
  size: 'xs',
};

function BuyButtons() {
  const router = useRouter();
  const buttonLabelsIn = {
    path: ['dca-in', 'dca-plus-in', 'weighted-scale-in'],
    buttonText: ['DCA In', 'DCA+ In', 'Weighted Scale In'],
  };

  return (
    <ButtonGroup>
      {buttonLabelsIn.path.map((el, index) => {
        if (router.pathname.includes(el)) {
          return (
            <Button {...buttonStyles} color="brand.200" borderColor="brand.200" key={el}>
              {buttonLabelsIn.buttonText[index]}
            </Button>
          );
        }
        return <Button {...buttonStyles}>{buttonLabelsIn.buttonText[index]}</Button>;
      })}
    </ButtonGroup>
  );
}
function SellButtons() {
  const router = useRouter();
  const buttonLabelsIn = {
    path: ['dca-out', 'dca-plus-out', 'weighted-scale-out'],
    buttonText: ['DCA Out', 'DCA+ Out', 'Weighted Scale Out'],
  };

  return (
    <ButtonGroup>
      {buttonLabelsIn.path.map((el, index) => {
        if (router.pathname.includes(el)) {
          return (
            <Button {...buttonStyles} color="brand.200" borderColor="brand.200" key={el}>
              {buttonLabelsIn.buttonText[index]}
            </Button>
          );
        }
        return <Button {...buttonStyles}>{buttonLabelsIn.buttonText[index]}</Button>;
      })}
    </ButtonGroup>
  );
}

function AssetsTabSelectors() {
  const [buttonClicked, setButtonClicked] = useState('Buy');
  const buttonOptions = ['Buy strategies', 'Sell strategies'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: 'Buy strategies',
    onChange: setButtonClicked,
  });

  const categoryGroup = getRootProps();

  return (
    <VStack spacing={4} pb={6}>
      <HStack {...categoryGroup} spacing={8}>
        {buttonOptions.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <CategoryRadioCard key={value} {...radio} buttonClicked={buttonClicked}>
              {value}
            </CategoryRadioCard>
          );
        })}
      </HStack>
      {buttonClicked.includes('Buy') ? <BuyButtons /> : <SellButtons />}
    </VStack>
  );
}

function DcaIn() {
  const { connected } = useWallet();
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(steps);

  const { data: balances } = useBalances();

  const { validate } = useValidation(step1ValidationSchema, { balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
  }

  const initialValues = {
    ...state.step1,
    initialDenom: state.step1.initialDenom,
    resultingDenom: state.step1.resultingDenom,
  };

  console.log(initialValues);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <ModalWrapper reset={actions.resetAction} stepsConfig={steps}>
          <AssetsTabSelectors />
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenom />
              <DCAInResultingDenom
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <DcaIn />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
