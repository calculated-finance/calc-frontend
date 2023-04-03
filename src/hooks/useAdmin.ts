// usewhitelist

import { useWallet } from './useWallet';

const admins = [
  'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt', // d
  'kujira1xgq5meypfxhhepz6htpv9rn848xhqd2dw3gany', // a
  'kujira1a0uqtx4erytfy2hgeysccjqusrz8ygq9ssjj0p', // f
  'kujira1y4k0re9q905nvvcvvmxug3sqtd9e7du4709d0t', // j
];

export function isAddressAdmin(address: string | undefined | null) {
  return address && admins.includes(address);
}

export function useAdmin() {
  const { address } = useWallet();
  return {
    isAdmin: isAddressAdmin(address),
  };
}
