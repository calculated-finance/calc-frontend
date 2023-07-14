import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
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
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { StrategyInfoProvider } from '../customise/useStrategyInfo';

function StrategyInfoModal({ isOpen, onClose }: Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Performance free</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={8}>
            <Stack spacing={1}>
              <Text>Figure 1: A visual representation of a performance fee</Text>
            </Stack>
            <Stack spacing={1}>
              <Text>Figure 2: A visual representation of when no performance fees are charged</Text>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function CategoryRadioCard({ ...props }: UseRadioProps & ChildrenProp) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const { isOpen: isBuyOpen, onOpen: onBuyOpen, onClose: onBuyClose } = useDisclosure();
  // const { isOpen: isSellOpen, onOpen: onSellOpen, onClose: onSellClose } = useDisclosure();

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
            <Button variant="link" size="xs" color="slategrey" onClick={onBuyOpen}>
              <Icon as={QuestionOutlineIcon} />
            </Button>
          </HStack>
        </Center>
      </Box>
      <StrategyInfoModal isOpen={isBuyOpen} onClose={onBuyClose} />
    </Box>
  );
}

function StrategyTypeRadioCard({ ...props }: UseRadioProps & ChildrenProp) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="lg"
        _checked={{
          color: 'brand.200',
          borderColor: 'brand.200',
        }}
        fontSize={14}
        textAlign="center"
        whiteSpace="nowrap"
        w={32}
        px={1}
        py={1}
      >
        {props.children}
      </Box>
    </Box>
  );
}

function AssetsTabSelectors() {
  // const [group1Value, setGroup1Value] = useState('');
  // const [group2Value, setGroup2Value] = useState('');

  // const handleGroup1Change = (value: any) => {
  //   setGroup1Value(value);
  // };

  // const handleGroup2Change = (value: any) => {
  //   setGroup2Value(value);
  // };

  const buttonOptions = {
    category: ['Buy strategies', 'Sell strategies'],
    strategyType: {
      displayName: ['DCA', 'DCA+', 'Weighted scale'],
      pathName: ['dca', 'dca-plus', 'weighted-scale'],
    },
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: 'Buy strategies',
    onChange: console.log,
  });
  const { getRootProps: rootPropsStrategyType, getRadioProps: radioPropsStrategyType } = useRadioGroup({
    name: 'strategy-type',
    defaultValue: 'DCA',
    onChange: (value) => {
      const selectedPathName =
        buttonOptions.strategyType.pathName[buttonOptions.strategyType.displayName.indexOf(value)];
      console.log(selectedPathName);
    },
  });

  const categoryGroup = getRootProps();
  const strategyTypeGroup = rootPropsStrategyType();

  const handleStrategyType = () => {
    const url = `/create-strategy/${rootPropsStrategyType}-${getRootProps}/assets`;

    console.log(url);
  };

  return (
    <VStack spacing={4} pb={6}>
      <HStack {...categoryGroup} spacing={8}>
        {buttonOptions.category.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <CategoryRadioCard key={value} {...radio}>
              {value}
            </CategoryRadioCard>
          );
        })}
      </HStack>
      <HStack {...strategyTypeGroup} spacing={2}>
        {buttonOptions.strategyType.displayName.map((value) => {
          const radio = radioPropsStrategyType({ value });
          return (
            <StrategyTypeRadioCard key={value} {...radio}>
              {value}
            </StrategyTypeRadioCard>
          );
        })}
      </HStack>
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
