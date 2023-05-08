import { getChainContractAddress, getMarsAddress } from '@helpers/chains';
import { Chains } from '@hooks/useChain';
import { Destination } from 'src/interfaces/generated-osmosis/execute';

export function getCallbackDestinations(
  chain: Chains,
  autoStakeValidator: string | null | undefined,
  recipientAccount: string | null | undefined,
  yieldOption: string | null | undefined,
  senderAddress: string,
  reinvestStrategy: string | null | undefined,
) {
  const destinations = [] as Destination[];

  if (autoStakeValidator) {
    destinations.push({
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
    });
  }

  if (recipientAccount) {
    destinations.push({ address: recipientAccount, allocation: '1.0', msg: null });
  }

  if (reinvestStrategy) {
    const msg = {
      deposit: {
        vault_id: reinvestStrategy,
        address: senderAddress,
      },
    };
    destinations.push({
      address: getChainContractAddress(chain),
      allocation: '1.0',
      msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
    });
  }
  if (yieldOption) {
    if (yieldOption === 'mars') {
      const msg = {
        deposit: {
          on_behalf_of: senderAddress,
        },
      };
      destinations.push({
        address: getMarsAddress(),
        allocation: '1.0',
        msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
      });
    }
  }

  return destinations.length ? destinations : undefined;
}
