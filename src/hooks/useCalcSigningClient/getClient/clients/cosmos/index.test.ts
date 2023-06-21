import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainContractAddress } from '@helpers/chains';
import { Strategy } from '@models/Strategy';
import { getStrategyInitialDenom } from '@helpers/strategy';
import { Chains } from '@hooks/useChain/Chains';
import { getCosmosSigningClient } from '.';

// Import the function from its module

// Mocking dependencies
jest.mock('@cosmjs/cosmwasm-stargate');
jest.mock('@helpers/chains');
jest.mock('@helpers/strategy');

describe('executeTopUpCosmos function', () => {
  let mockClient: jest.Mocked<SigningCosmWasmClient>;
  let strategy: Strategy;
  let chain: Chains;

  beforeEach(() => {
    // Mock the SigningCosmWasmClient
    mockClient = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SigningCosmWasmClient>;

    // Setup strategy object
    strategy = {
      id: '1',
      owner: 'address1',
    } as Strategy;

    // Set chain
    chain = 'exampleChain' as Chains;

    // Mock helper functions
    (getChainContractAddress as jest.Mock).mockReturnValue('contractAddress');
    (getStrategyInitialDenom as jest.Mock).mockReturnValue({
      deconversion: jest.fn().mockReturnValue(1000),
      id: 'strategy_denom_id',
    });
  });

  it('should successfully execute top up and be called with correct arguments', async () => {
    const cosmosSigningClient = getCosmosSigningClient(mockClient, chain);
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
    const cosmosSigningClient = getCosmosSigningClient(mockClient, chain);

    try {
      await cosmosSigningClient.topUpStrategy('address2', strategy, 10);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('You are not the owner of this strategy');
    }
  });
});
