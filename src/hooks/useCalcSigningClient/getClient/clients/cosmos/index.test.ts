import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Strategy } from '@models/Strategy';
import { getStrategyInitialDenom } from '@helpers/strategy';
import { defaultDenom } from '@utils/defaultDenom';
import { TestnetDenoms } from '@models/Denom';
import { TransactionType } from '@components/TransactionType';
import { BuildCreateVaultContext } from '@hooks/useCreateVault/buildCreateVaultParams';
import { encodeMsg } from '@hooks/useCreateVault/getCreateVaultExecuteMsg';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';
import timekeeper from 'timekeeper';
import { AuthorizationType, StakeAuthorization } from 'cosmjs-types/cosmos/staking/v1beta1/authz';
import { getCosmosSigningClient } from '.';
import { mockChainConfig } from '../../../../../fixtures/mockChainConfig';

// Import the function from its module

// Mocking dependencies
jest.mock('@cosmjs/cosmwasm-stargate');
jest.mock('@helpers/chains');
jest.mock('@helpers/strategy');

describe('getCosmosSigningClient', () => {
  let mockClient: jest.Mocked<SigningCosmWasmClient>;
  let strategy: Strategy;

  beforeAll(() => {
    // Lock Time
    timekeeper.freeze(new Date('2022-11-02T00:00:00.000+00:00'));
  });

  beforeEach(() => {
    // Mock the SigningCosmWasmClient
    mockClient = {
      execute: jest.fn(),
      signAndBroadcast: jest.fn().mockResolvedValue({ data: 'txHash' }),
    } as unknown as jest.Mocked<SigningCosmWasmClient>;

    // Setup strategy object
    strategy = {
      id: '1',
      owner: 'address1',
    } as Strategy;

    // Mock helper functions
    (getStrategyInitialDenom as jest.Mock).mockReturnValue({
      deconversion: jest.fn().mockReturnValue(1000),
      id: 'strategy_denom_id',
    });
  });
  describe('executeTopUpCosmos function', () => {
    it('should successfully execute top up and be called with correct arguments', async () => {
      const cosmosSigningClient = getCosmosSigningClient(mockClient, mockChainConfig);
      const address = 'address1';
      const topUpAmount = 10;
      const expectedMsg: ExecuteMsg = {
        deposit: {
          vault_id: strategy.id,
          address,
        },
      };
      const expectedFunds = [{ denom: 'strategy_denom_id', amount: '1000' }];

      await cosmosSigningClient.topUpStrategy(address, strategy, topUpAmount);

      expect(mockClient.execute).toHaveBeenCalled();
      expect(mockClient.execute).toHaveBeenCalledWith(
        address,
        'contractAddress',
        expectedMsg,
        'auto',
        undefined,
        expectedFunds,
      );
    });

    it('should throw error if not owner of the strategy', async () => {
      const cosmosSigningClient = getCosmosSigningClient(mockClient, mockChainConfig);

      try {
        await cosmosSigningClient.topUpStrategy('address2', strategy, 10);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('You are not the owner of this strategy');
      }
    });
  });

  describe('createVault function', () => {
    it('should successfully create vault', async () => {
      const cosmosSigningClient = getCosmosSigningClient(mockClient, mockChainConfig);
      const address = 'address1';
      const createVaultContext: BuildCreateVaultContext = {
        initialDenom: { ...defaultDenom, id: 'ukuji' },
        resultingDenom: { ...defaultDenom, id: TestnetDenoms.Demo },
        timeInterval: {
          increment: 1,
          interval: 'daily',
        },
        swapAmount: 10,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1,
        destinationConfig: {
          chainConfig: mockChainConfig,
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyData: undefined,
        },
      };

      await cosmosSigningClient.createStrategy(address, 100, '100', createVaultContext);

      expect(mockClient.signAndBroadcast).toHaveBeenCalled();
      expect(mockClient.signAndBroadcast).toHaveBeenCalledWith(
        address,
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: 'address1',
              contract: 'contractAddress',
              msg: encodeMsg({
                create_vault: {
                  label: '',
                  time_interval: { custom: { seconds: 86400 } },
                  target_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                  swap_amount: '10000000',
                  slippage_tolerance: '0.01',
                },
              }),
              funds: [{ denom: 'ukuji', amount: '100000000' }],
            },
          },
          {
            typeUrl: '/cosmos.bank.v1beta1.MsgSend',
            value: {
              fromAddress: 'address1',
              toAddress: 'feeTakerAddress',
              amount: [{ denom: 'ukuji', amount: '100' }],
            },
          },
        ],
        'auto',
      );
    });

    it('should successfully create vault with no fee', async () => {
      const cosmosSigningClient = getCosmosSigningClient(mockClient, mockChainConfig);
      const address = 'address1';
      const createVaultContext: BuildCreateVaultContext = {
        initialDenom: { ...defaultDenom, id: 'ukuji' },
        resultingDenom: { ...defaultDenom, id: TestnetDenoms.Demo },
        timeInterval: {
          increment: 1,
          interval: 'daily',
        },
        swapAmount: 10,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1,
        destinationConfig: {
          chainConfig: mockChainConfig,
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyData: undefined,
        },
      };

      await cosmosSigningClient.createStrategy(address, 10, undefined, createVaultContext);

      expect(mockClient.signAndBroadcast).toHaveBeenCalled();
      expect(mockClient.signAndBroadcast).toHaveBeenCalledWith(
        address,
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: 'address1',
              contract: 'contractAddress',
              msg: encodeMsg({
                create_vault: {
                  label: '',
                  time_interval: { custom: { seconds: 86400 } },
                  target_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                  swap_amount: '10000000',
                  slippage_tolerance: '0.01',
                },
              }),
              funds: [{ denom: 'ukuji', amount: '10000000' }],
            },
          },
        ],
        'auto',
      );
    });

    it('should successfully create vault with autostaking', async () => {
      const cosmosSigningClient = getCosmosSigningClient(mockClient, mockChainConfig);
      const address = 'address1';
      const createVaultContext: BuildCreateVaultContext = {
        initialDenom: { ...defaultDenom, id: 'ukuji' },
        resultingDenom: { ...defaultDenom, id: TestnetDenoms.Demo },
        timeInterval: {
          increment: 1,
          interval: 'daily',
        },
        swapAmount: 10,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1,
        destinationConfig: {
          chainConfig: mockChainConfig,
          senderAddress: 'kujira1',
          autoStakeValidator: 'autostakevalidator',
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyData: undefined,
        },
      };

      await cosmosSigningClient.createStrategy(address, 10, undefined, createVaultContext);

      expect(mockClient.signAndBroadcast).toHaveBeenCalled();
      expect(mockClient.signAndBroadcast).toHaveBeenCalledWith(
        address,
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: 'address1',
              contract: 'contractAddress',
              msg: encodeMsg({
                create_vault: {
                  label: '',
                  time_interval: { custom: { seconds: 86400 } },
                  target_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                  swap_amount: '10000000',
                  slippage_tolerance: '0.01',
                  destinations: [
                    {
                      address: 'contractAddress',
                      allocation: '1.0',
                      msg: Buffer.from(
                        JSON.stringify({
                          z_delegate: { delegator_address: 'kujira1', validator_address: 'autostakevalidator' },
                        }),
                      ).toString('base64'),
                    },
                  ],
                },
              }),
              funds: [{ denom: 'ukuji', amount: '10000000' }],
            },
          },
          {
            typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
            value: {
              granter: 'address1',
              grantee: 'contractAddress',
              grant: {
                authorization: {
                  typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                  value: GenericAuthorization.encode(
                    GenericAuthorization.fromPartial({ msg: '/cosmos.staking.v1beta1.MsgDelegate' }),
                  ).finish(),
                },
                expiration: Timestamp.fromPartial({ seconds: 1698883200, nanos: 0 }),
              },
            },
          },
        ],
        'auto',
      );
    });

    it('should successfully create vault with autostaking and autocompounding', async () => {
      const cosmosSigningClient = getCosmosSigningClient(mockClient, mockChainConfig);
      const address = 'address1';
      const createVaultContext: BuildCreateVaultContext = {
        initialDenom: { ...defaultDenom, id: 'ukuji' },
        resultingDenom: { ...defaultDenom, id: TestnetDenoms.Demo },
        timeInterval: {
          increment: 1,
          interval: 'daily',
        },
        swapAmount: 10,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1,
        destinationConfig: {
          chainConfig: mockChainConfig,
          senderAddress: 'kujira1',
          autoStakeValidator: 'autostakevalidator',
          autoCompoundStakingRewards: true,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyData: undefined,
        },
      };

      await cosmosSigningClient.createStrategy(address, 10, undefined, createVaultContext);

      expect(mockClient.signAndBroadcast).toHaveBeenCalled();
      expect(mockClient.signAndBroadcast).toHaveBeenCalledWith(
        address,
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: 'address1',
              contract: 'contractAddress',
              msg: encodeMsg({
                create_vault: {
                  label: '',
                  time_interval: { custom: { seconds: 86400 } },
                  target_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                  swap_amount: '10000000',
                  slippage_tolerance: '0.01',
                  destinations: [
                    {
                      address: 'contractAddress',
                      allocation: '1.0',
                      msg: Buffer.from(
                        JSON.stringify({
                          z_delegate: { delegator_address: 'kujira1', validator_address: 'autostakevalidator' },
                        }),
                      ).toString('base64'),
                    },
                  ],
                },
              }),
              funds: [{ denom: 'ukuji', amount: '10000000' }],
            },
          },
          {
            typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
            value: {
              granter: 'address1',
              grantee: 'contractAddress',
              grant: {
                authorization: {
                  typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                  value: GenericAuthorization.encode(
                    GenericAuthorization.fromPartial({ msg: '/cosmos.staking.v1beta1.MsgDelegate' }),
                  ).finish(),
                },
                expiration: Timestamp.fromPartial({ seconds: 1698883200, nanos: 0 }),
              },
            },
          },
          {
            typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
            value: {
              granter: 'address1',
              grantee: 'autoCompoundStakingRewardsAddress',
              grant: {
                authorization: {
                  typeUrl: '/cosmos.staking.v1beta1.StakeAuthorization',
                  value: StakeAuthorization.encode(
                    StakeAuthorization.fromPartial({
                      authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
                      allowList: {
                        address: ['autostakevalidator'],
                      },
                    }),
                  ).finish(),
                },
                expiration: { seconds: { low: 1698883200, high: 0, unsigned: false }, nanos: 0 },
              },
            },
          },
        ],
        'auto',
      );
    });
  });
});
