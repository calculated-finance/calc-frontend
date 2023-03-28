// usewhitelist

import { isMainnet } from '@utils/isMainnet';
import { useWallet } from '@wizard-ui/react';

const whitelist = [
  'kujira1ay2e2mgmdzkcp7we97v2aarjdh30nz4kuygghk',
  'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
  'kujira1xgq5meypfxhhepz6htpv9rn848xhqd2dw3gany',
  'kujira1a0uqtx4erytfy2hgeysccjqusrz8ygq9ssjj0p',
  'kujira1y4k0re9q905nvvcvvmxug3sqtd9e7du4709d0t',
];

export function isAddressWhitelisted(address: string) {
  return whitelist.includes(address);
}

export default function useWhitelist() {
  const { address } = useWallet();

  return {
    isWhitelisted: isAddressWhitelisted(address) || !isMainnet(),
  };
}
