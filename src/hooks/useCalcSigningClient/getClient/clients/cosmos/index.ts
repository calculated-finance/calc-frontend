import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainConfig } from '@helpers/chains';
import { Strategy } from '@models/Strategy';
import { getStrategyInitialDenom } from '@helpers/strategy';
import { EncodeObject } from '@cosmjs/proto-signing';
import { getFeeMessage } from '@helpers/getFeeMessage';
import { BuildCreateVaultContext, buildCreateVaultMsg } from '@hooks/useCreateVault/buildCreateVaultParams';
import { executeCreateVault } from '@hooks/useCreateVault/executeCreateVault';
import { getExecuteMsg } from '@hooks/useCreateVault/getCreateVaultExecuteMsg';
import { AuthorizationType, StakeAuthorization } from 'cosmjs-types/cosmos/staking/v1beta1/authz';
import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';

function executeTopUpCosmos(
  address: string,
  client: SigningCosmWasmClient,
  chainConfig: ChainConfig,
  strategy: Strategy,
  topUpAmount: number,
) {
  if (strategy.owner !== address) {
    throw new Error('You are not the owner of this strategy');
  }
  const { deconversion, id } = getStrategyInitialDenom(strategy);

  const msg = {
    deposit: {
      vault_id: strategy.id,
      address,
    },
  } as ExecuteMsg;

  const funds = [{ denom: id, amount: BigInt(deconversion(topUpAmount)).toString() }];

  const result = client.execute(address, chainConfig.contractAddress, msg, 'auto', undefined, funds);
  return result;
}

export function getGrantMsg(
  granter: string,
  grantee: string,
  typeUrl = '/cosmos.authz.v1beta1.GenericAuthorization',
  value = GenericAuthorization.encode(
    GenericAuthorization.fromPartial({ msg: '/cosmos.staking.v1beta1.MsgDelegate' }),
  ).finish(),
  seconds: number = new Date().getTime() / 1000 + 31536000, // 31536000 seconds in a year
): { typeUrl: string; value: MsgGrant } {
  return {
    typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
    value: {
      granter,
      grantee,
      grant: {
        authorization: {
          typeUrl,
          value,
        },
        expiration: Timestamp.fromPartial({ seconds, nanos: 0 }),
      },
    } as MsgGrant,
  };
}

function addGrants(
  autoStakeValidator: string | undefined,
  msgs: EncodeObject[],
  senderAddress: string,
  chainConfig: ChainConfig,
  autoCompoundStakingRewards: boolean | undefined,
) {
  if (autoStakeValidator) {
    msgs.push(getGrantMsg(senderAddress, chainConfig.contractAddress));

    if (autoCompoundStakingRewards) {
      msgs.push(
        getGrantMsg(
          senderAddress,
          chainConfig.autoCompoundStakingRewardsAddress,
          '/cosmos.staking.v1beta1.StakeAuthorization',
          StakeAuthorization.encode(
            StakeAuthorization.fromPartial({
              authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
              allowList: {
                address: [autoStakeValidator],
              },
            }),
          ).finish(),
        ),
      );
    }
  }
}

function getFunds(initialDenom: DenomInfo, initialDeposit: number) {
  const funds = [{ denom: initialDenom.id, amount: BigInt(initialDenom.deconversion(initialDeposit)).toString() }];

  const fundsInCoin = [
    Coin.fromPartial({
      amount: funds[0].amount,
      denom: funds[0].denom,
    }),
  ];
  return fundsInCoin;
}

async function createVault(
  signer: SigningCosmWasmClient,
  chainConfig: ChainConfig,
  senderAddress: string,
  initialDeposit: number,
  fee: string | undefined,
  createVaultContext: BuildCreateVaultContext,
) {
  const createVaultMsg = buildCreateVaultMsg(chainConfig, createVaultContext);

  const msgs: EncodeObject[] = [];
  const funds = getFunds(createVaultContext.initialDenom, initialDeposit);
  msgs.push(getExecuteMsg(createVaultMsg, funds, senderAddress, chainConfig.contractAddress));
  addGrants(
    createVaultContext.destinationConfig.autoStakeValidator,
    msgs,
    senderAddress,
    chainConfig,
    createVaultContext.destinationConfig.autoCompoundStakingRewards,
  );

  if (fee) {
    msgs.push(getFeeMessage(senderAddress, createVaultContext.initialDenom.id, fee, chainConfig.feeTakerAddress));
  }

  return executeCreateVault(signer, senderAddress, msgs);
}

export function getCosmosSigningClient(cosmSigner: SigningCosmWasmClient, chainConfig: ChainConfig) {
  return {
    topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
      executeTopUpCosmos(address, cosmSigner, chainConfig, strategy, topUpAmount),
    createStrategy: (
      address: string,
      initialDeposit: number,
      fee: string | undefined,
      variables: BuildCreateVaultContext,
    ) => createVault(cosmSigner, chainConfig, address, initialDeposit, fee, variables),
  };
}
