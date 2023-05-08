import { Destination } from 'src/interfaces/generated-osmosis/execute';
import { Chains } from '@hooks/useChain';
import { getChainContractAddress, getMarsAddress } from '@helpers/chains';
import { getCallbackDestinations } from '.';

jest.mock('@helpers/chains');
jest.mock('@hooks/useChain');

describe('getCallbackDestinations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an auto-stake destination when autoStakeValidator is provided', () => {
    const senderAddress = 'sender_address';
    const autoStakeValidator = 'validator_address';

    const result = getCallbackDestinations(Chains.Osmosis, autoStakeValidator, null, null, senderAddress, null);
    const expectedDestination: Destination = {
      address: getChainContractAddress(Chains.Osmosis),
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          z_delegate: {
            delegator_address: senderAddress,
            validator_address: autoStakeValidator,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a recipient destination when recipientAccount is provided', () => {
    const senderAddress = 'sender_address';
    const recipientAccount = 'recipient_account';

    const result = getCallbackDestinations(Chains.Osmosis, null, recipientAccount, null, senderAddress, null);
    const expectedDestination: Destination = {
      address: recipientAccount,
      allocation: '1.0',
      msg: null,
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a reinvest destination when reinvestStrategy is provided', () => {
    const senderAddress = 'sender_address';
    const reinvestStrategy = 'reinvest_strategy';
    const chain = Chains.Osmosis;

    const result = getCallbackDestinations(chain, null, null, null, senderAddress, reinvestStrategy);
    const expectedDestination: Destination = {
      address: getChainContractAddress(chain),
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          deposit: {
            vault_id: reinvestStrategy,
            address: senderAddress,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a reinvest destination when reinvestStrategy is provided for kujira', () => {
    const senderAddress = 'sender_address';
    const reinvestStrategy = 'reinvest_strategy';
    const chain = Chains.Kujira;

    const result = getCallbackDestinations(chain, null, null, null, senderAddress, reinvestStrategy);
    const expectedDestination: Destination = {
      address: getChainContractAddress(chain),
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          deposit: {
            vault_id: reinvestStrategy,
            address: senderAddress,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a mars destination when yieldOption is "mars"', () => {
    const senderAddress = 'sender_address';
    const yieldOption = 'mars';
    const marsAddress = getMarsAddress();

    const result = getCallbackDestinations(Chains.Osmosis, null, null, yieldOption, senderAddress, null);
    const expectedDestination: Destination = {
      address: marsAddress,
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          deposit: {
            on_behalf_of: senderAddress,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns undefined when no input is provided', () => {
    const senderAddress = 'sender_address';

    const result = getCallbackDestinations(Chains.Osmosis, null, null, null, senderAddress, null);

    expect(result).toBeUndefined();
  });
});
