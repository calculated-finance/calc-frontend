import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import * as Sentry from '@sentry/react';
import { ETH_DCA_FACTORY_CONTRACT_ADDRESS } from 'src/constants';
import { useMetamask } from '@hooks/useMetamask';
import { ethers } from 'ethers';
import factoryContractJson from 'src/Factory.json';
import { Strategy } from '../useStrategies';
import { getExecutionInterval } from './buildCreateVaultParams';
import { DcaFormState } from './DcaFormState';

export function useMoonbeamCreateVault(
  state: DcaFormState | undefined
) {

  const { address } = useWallet();

  const provider = useMetamask(metaMaskState => metaMaskState.provider);
  const signer = useMetamask(metaMaskState => metaMaskState.signer);

  return useMutation<Strategy['id'] | undefined, Error, { price: number | undefined; }>(
    async ({ price }) => {

      const factoryContract = new ethers.Contract(ETH_DCA_FACTORY_CONTRACT_ADDRESS, factoryContractJson.abi, provider);

      const contractWithSigner = factoryContract.connect(signer);

      const preSwapAutomationType = 0;
      const swapAdjustmentType = 0;

      const postSwapAutomationParams = [
        {
          postSwapAutomationType: 0,
          destination: '0x5c8B07ad20AB2FE6e92198a595a0aB6e0327c5f1',
          basisPoints: 50,
        },
        // {
        // 	postSwapAutomationType: 0,
        // 	destination: destinationOne.address,
        // 	basisPoints: 475,
        // },
        // {
        // 	postSwapAutomationType: 0,
        // 	destination: destinationTwo.address,
        // 	basisPoints: 475,
        // },
      ];

      const triggerCreationConditionType = 0; // when vault has funds
      const performSwapConditionType = 0; // when vault has funds
      const finaliseVaultConditionType = 1; // when vault has no funds
      const finaliserType = 0;

      const { deconversion } = getDenomInfo(state?.initialDenom);


      const params = {
        owner: address,
        tokenIn: state?.initialDenom,
        tokenOut: state?.resultingDenom,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        swapAmount: ethers.parseEther(deconversion(state!.swapAmount).toString()).toString(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        timeInterval: getExecutionInterval(state!.executionInterval, state!.executionIntervalIncrement).custom.seconds.toString(),
        targetTime: Math.floor(Date.now() / 1000) + 100,
        swapAdjustmentType,
        preSwapAutomationType,
        postSwapAutomationParams,
        finaliserType,
        triggerCreationConditionType,
        performSwapConditionType,
        finaliseVaultConditionType,
        simulation: false,
        referenceVaultAddress: ethers.ZeroAddress
      };



                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      const tx = await contractWithSigner.createVault(
        params
      );


      const receipt = await tx.wait();


      return receipt;

      // const referenceVaultCreatedEvent = receipt.events.find(
      // 	(e) => e.event === 'VaultCreated'
      // )
      // const referenceVaultAddress = referenceVaultCreatedEvent.args.vaultAddress
      // return referenceVaultAddress;
      // const data =
      // '0x321695310000000000000000000000001af6fca482cd73c198b8c0f3c883be8d9bf5cf74000000000000000000000000a6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa0000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb032889000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000064361265';
      // const contractInterface = new Interface(factoryContractJson);
      // const parsed = contractInterface.parseTransaction({ data });
      // console.log('parsed', parsed);
    },
    {
      onError: (error) => {
        if (error.message.includes('Request rejected')) {
          return;
        }
        Sentry.captureException(error);
      },
    }
  );
}
