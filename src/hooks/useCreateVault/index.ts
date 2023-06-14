/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { Coin  } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { EncodeObject   } from '@cosmjs/proto-signing';
import { getFeeMessage } from '@helpers/getFeeMessage';

import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { useChain } from '@hooks/useChain';
import { getChainContractAddress, getChainFeeTakerAddress } from '@helpers/chains';
import { useWeightedScaleConfirmForm } from '@hooks/useWeightedScaleForm';
import usePrice from '@hooks/usePrice';
import * as Sentry from '@sentry/react';
import useStrategy from '@hooks/useStrategy';
import { isNil } from 'lodash';
import { useAnalytics } from '@hooks/useAnalytics';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { ETH_DCA_FACTORY_CONTRACT_ADDRESS } from 'src/constants';
import { useMetamask } from '@hooks/useMetamask';
import { ethers } from 'ethers';
import { Chains } from '@hooks/useChain/Chains';
import { Denom } from '@models/Denom';
import factoryContractJson from 'src/Factory.json'
import usePairs from '../usePairs';
import { useConfirmForm } from '../useDcaInForm';
import { Strategy } from '../useStrategies';
import { getGrantMsg } from './getGrantMsg';
import { getExecuteMsg } from './getCreateVaultExecuteMsg';
import { buildCreateVaultParams, getExecutionInterval } from './buildCreateVaultParams';
import { executeCreateVault } from './executeCreateVault';
import { DcaFormState } from './DcaFormState';



function getFunds(initialDenom: Denom, initialDeposit: number) {
  const { deconversion } = getDenomInfo(initialDenom);
  const funds = [{ denom: initialDenom, amount: BigInt(deconversion(initialDeposit)).toString() }];

  const fundsInCoin = [
    Coin.fromPartial({
      amount: funds[0].amount,
      denom: funds[0].denom,
    }),
  ];
  return fundsInCoin;
}



function useMoonbeamCreateVault(
  state: DcaFormState | undefined
) {

  const { address } = useWallet();

  const provider = useMetamask(metaMaskState => metaMaskState.provider)
  const signer = useMetamask(metaMaskState => metaMaskState.signer)



  // useEffect(() => {
  //   if (factoryContract === null) {
  //     return;
  //   }

  //   if (signer === null) {
  //     return;
  //   }

  //   const getVaultsByAddress = async () => {
  //     const address = await signer.getAddress();
  //     const vaults = await factoryContract.getVaultsByAddress(address);
  //     setVaults(vaults);
  //   };

  //   getVaultsByAddress();
  // }, [factoryContract, signer]);



  
  return useMutation<Strategy['id'] | undefined, Error, { price: number | undefined }>(
    async ({ price }) => {
   
    const factoryContract = new ethers.Contract(ETH_DCA_FACTORY_CONTRACT_ADDRESS, factoryContractJson.abi, provider);
  
      const contractWithSigner = factoryContract.connect(signer);

      const preSwapAutomationType = 0
			const swapAdjustmentType = 0

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
			]

			const triggerCreationConditionType = 0 // when vault has funds
			const performSwapConditionType = 0 // when vault has funds
			const finaliseVaultConditionType = 1 // when vault has no funds
			const finaliserType = 0
  
  
      const params = {
        owner: address,
        tokenIn: state?.initialDenom,
        tokenOut: state?.resultingDenom,
        swapAmount: ethers.parseEther(state?.initialDeposit.toString()),
        timeInterval: getExecutionInterval(state?.executionInterval, state?.executionIntervalIncrement).custom.seconds.toString(),
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



      console.log('params', params);
  
      const tx = await contractWithSigner.createVault(
        params
      );

      console.log('hi')
  
      console.log('tx', tx);
  
      const receipt = await tx.wait();
  
      console.log('wait', receipt);

      const referenceVaultCreatedEvent = receipt.events.find(
				(e) => e.event === 'VaultCreated'
			)
			const referenceVaultAddress = referenceVaultCreatedEvent.args.vaultAddress
      return referenceVaultAddress;

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
    },
  );
}

const useCreateVault = (
  state: DcaFormState | undefined,
  excludeCreationFee: boolean,
  dexPrice?: number | undefined,
) => {
  const msgs: EncodeObject[] = [];
  const { address: senderAddress, signingClient: client } = useWallet();
  const { data: pairsData } = usePairs();
  const { chain } = useChain();

  const { formName, transactionType} = useStrategyInfo();

  const { walletType } = useWallet();

  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy || undefined);

  const { track } = useAnalytics();

 

  const evmCreate = useMoonbeamCreateVault(state);

  const cosmosCreate = useMutation<Strategy['id'] | undefined, Error, { price: number | undefined }>(
    ({ price }) => {
      if (!state) {
        throw new Error('No state');
      }

      if (!price) {
        throw new Error('No fiat price');
      }

      if (!client) {
        throw Error('Invalid client');
      }

      if (!chain) {
        throw Error('Invalid chain');
      }

      if (!senderAddress) {
        throw Error('Invalid sender address');
      }

      const { pairs } = pairsData || {};

      if (!pairs) {
        throw Error('No pairs found');
      }

      if (!price) {
        throw Error('No price data found');
      }

      if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
        throw new Error('Invalid reinvest strategy.');
      }

      if (reinvestStrategyData && reinvestStrategyData.vault.owner !== senderAddress) {
        throw new Error('Reinvest strategy does not belong to user.');
      }

      const { autoStakeValidator } = state;

      if (autoStakeValidator) {
        msgs.push(getGrantMsg(senderAddress, chain));
      }

      const createVaultMsg = buildCreateVaultParams(formName, state, pairs, transactionType, senderAddress, dexPrice, chain);

      const funds = getFunds(state.initialDenom, state.initialDeposit);

      msgs.push(getExecuteMsg(createVaultMsg, funds, senderAddress, getChainContractAddress(chain)));

      if (!excludeCreationFee) {
        const tokensToCoverFee = createStrategyFeeInTokens(price);
        msgs.push(getFeeMessage(senderAddress, state.initialDenom, tokensToCoverFee, getChainFeeTakerAddress(chain)));
      }

      return executeCreateVault(client, senderAddress, msgs).then((res) => {
        track('Strategy Created', { formName, chain, address: senderAddress, walletType });
        return res;
      });
    },
    {
      onError: (error) => {
        if (error.message.includes('Request rejected')) {
          return;
        }
        Sentry.captureException(error, { tags: { chain, formName, ...state } });
      },
    },
  );

  return chain === Chains.Moonbeam ? evmCreate : cosmosCreate;
};

export const useCreateVaultDca = () => {
  const { state } = useConfirmForm();

  return useCreateVault(state, false);
};

export const useCreateVaultDcaPlus = () => {
  const { state } = useDcaPlusConfirmForm();

  return useCreateVault(state, false);
};

export const useCreateVaultWeightedScale = () => {
  const { state } = useWeightedScaleConfirmForm();

  const { transactionType } = useStrategyInfo();

  const enablePriceCheck = isNil((state as WeightedScaleState)?.basePriceValue);
  const { price: dexPrice } = usePrice(
    state && getDenomInfo(state.resultingDenom),
    state && getDenomInfo(state.initialDenom),
    transactionType,
    enablePriceCheck,
  );

  return useCreateVault( state, true, dexPrice);
};
