import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import { useCreateVaultDca } from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryTheSwap } from '@components/Summary/SummaryTheSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { FormikHelpers } from 'formik';
import { StrategyTypes } from '@models/StrategyTypes';
import Fees from '@components/Fees';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { FormNames } from '@hooks/useFormStore';
import { useEffect, useState } from 'react';
import { Interface, ethers } from 'ethers';
import { ETH_DCA_FACTORY_CONTRACT_ADDRESS } from 'src/constants';

function Page() {
  const { state, actions } = useConfirmForm(FormNames.DcaIn);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(steps);

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null)
  const [vaults, setVaults] = useState<string[]>([])

  useEffect(() => {
    console.log('running effect for ethers')
    // @ts-ignore
    if (window.ethereum === null)
    {
      return
    }

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider)
  }, [])

  useEffect(() => {
    console.log('running effect for signer')

    if (provider === null)
    {
      return
    }

    if (signer !== null)
    {
      return
    }

    const fetchSigner = async () => {
      const newSigner = await provider.getSigner()
      setSigner(newSigner)
    }

    fetchSigner()
  }, [provider, signer])

  useEffect(() => {
    if (provider === null)
    {
      return
    }

    if (factoryContract !== null)
    {
      return
    }

    const abi = [
      "function getVaultsByAddress(address owner) public view returns (address[])",
      "function createVault(address owner, address tokenIn, address tokenOut, uint256 swapAmount, uint256 timeInterval, uint256 targetTime) public returns (address)"
    ]

    const contract = new ethers.Contract(ETH_DCA_FACTORY_CONTRACT_ADDRESS, abi, provider)
    setFactoryContract(contract)

  }, [provider, factoryContract])

  useEffect(() => {
    if (factoryContract === null)
    {
      return
    }

    if (signer === null)
    {
      return
    }

    const getVaultsByAddress = async () => {
      const address = await signer.getAddress()
      const vaults = await factoryContract.getVaultsByAddress(address)
      setVaults(vaults)
    }

    getVaultsByAddress()
  }, [factoryContract, signer])

  const createVault = async () => {
    if (factoryContract === null) {
      return
    }

    if (signer === null) {
      return
    }

    const contractWithSigner = factoryContract.connect(signer)

    console.log(factoryContract, contractWithSigner)

    const address = await signer.getAddress()

    const params = {
      owner: address,
      tokenIn: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      tokenOut: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      swapAmount: ethers.parseEther('0.00001'),
      timeInterval: 60,
      targetTime: Math.floor(Date.now() / 1000) + 100
    }

    const tx = await contractWithSigner.createVault(
      params.owner,
      params.tokenIn,
      params.tokenOut,
      params.swapAmount,
      params.timeInterval,
      params.targetTime
    )

    console.log('tx', tx)

    const wait = await tx.wait()

    console.log('wait', wait)
  }

  const data = '0x321695310000000000000000000000001af6fca482cd73c198b8c0f3c883be8d9bf5cf74000000000000000000000000a6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa0000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb032889000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000064361265'

  const abi = [
    "function getVaultsByAddress(address owner) public view returns (address[])",
    "function createVault(address owner, address tokenIn, address tokenOut, uint256 swapAmount, uint256 timeInterval, uint256 targetTime) public returns (address)"
  ]

  const contractInterface = new Interface(abi)
  const parsed = contractInterface.parseTransaction({ data })
  console.log('parsed', parsed)

  const { mutate, isError, error, isLoading } = useCreateVaultDca(FormNames.DcaIn, TransactionType.Buy);

  const handleSubmit = async (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) => {
    try {
      await createVault()
    }
    catch (e) {
      console.log('error', e)
    }
    finally {
      setSubmitting(false)
    }
  }
    // mutate(undefined, {
    //   onSuccess: async (strategyId) => {
    //     await nextStep({
    //       strategyId,
    //       timeSaved: state && getTimeSaved(state.initialDeposit, state.swapAmount),
    //     });
    //     actions.resetAction();
    //   },
    //   onSettled: () => {
    //     setSubmitting(false);
    //   },
    // });

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
        Confirm &amp; Sign
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={state.initialDenom}
              resultingDenom={state.resultingDenom}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAIn} />
            <SummaryTheSwap state={state} />
            <SummaryWhileSwapping state={state} />
            <SummaryAfterEachSwap state={state} />
            <Fees formName={FormNames.DcaIn} />
            <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
          </Stack>
        ) : (
          <InvalidData onRestart={handleRestart} />
        )}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
Page.getLayout = getFlowLayout;

export default Page;
