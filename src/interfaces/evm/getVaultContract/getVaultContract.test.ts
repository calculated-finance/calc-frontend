import { ContractRunner, Contract } from 'ethers';
import vaultContractJson from '../Vault.json';
import getVaultContract from './getVaultContract';

jest.mock('ethers');

describe('getVaultContract', () => {
  let mockContractRunner: ContractRunner;

  beforeEach(() => {
    mockContractRunner = {} as ContractRunner;
    (Contract as jest.Mock).mockClear();
  });

  it('should create and return an ethers contract with the correct parameters', () => {
    const strategyId = 'strategy1';

    getVaultContract(mockContractRunner, strategyId);

    expect(Contract).toHaveBeenCalledWith(strategyId, vaultContractJson.abi, mockContractRunner);
  });
});
