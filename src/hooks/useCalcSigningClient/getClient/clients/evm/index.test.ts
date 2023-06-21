import { ethers } from 'ethers';
import { getStrategyInitialDenom } from '@helpers/strategy';
import { getDenomContract } from 'src/interfaces/evm/getDenomContract';
import getVaultContract from 'src/interfaces/evm/getVaultContract';
import { getEVMSigningClient } from '.';

jest.mock('@helpers/strategy');
jest.mock('src/interfaces/evm/getDenomContract');
jest.mock('src/interfaces/evm/getVaultContract');

describe('getEVMSigningClient', () => {
  let mockSigner: any;
  let mockStrategy: any;

  beforeEach(() => {
    mockSigner = {};
    mockStrategy = {
      id: 'mock-strategy-id',
    };

    (getStrategyInitialDenom as jest.Mock).mockReturnValue({
      deconversion: 'mock-deconversion',
      id: 'mock-initial-denom-id',
    });

    (getDenomContract as jest.Mock).mockReturnValue({
      approve: jest.fn().mockReturnValue({
        wait: jest.fn(),
      }),
    });

    (getVaultContract as jest.Mock).mockReturnValue({
      deposit: jest.fn().mockReturnValue({
        wait: jest.fn().mockReturnValue('mock-receipt'),
      }),
    });
  });

  it('should top up strategy', async () => {
    const client = getEVMSigningClient(mockSigner);
    const receipt = await client.topUpStrategy('mock-address', mockStrategy, 100);

    expect(receipt).toEqual('mock-receipt');
    expect(getDenomContract).toHaveBeenCalledWith(mockSigner, 'mock-initial-denom-id');
    expect(getVaultContract).toHaveBeenCalledWith(mockSigner, mockStrategy.id);

    const denomContract = getDenomContract(mockSigner, 'mock-initial-denom-id');
    expect(denomContract.approve).toHaveBeenCalled();

    const contractWithSigner = getVaultContract(mockSigner, mockStrategy.id);
    expect(contractWithSigner.deposit).toHaveBeenCalled();
  });
});
