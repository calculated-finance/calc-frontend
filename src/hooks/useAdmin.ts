// usewhitelist

import { isNil } from 'lodash';
import { useRouter } from 'next/router';
import { useWallet } from './useWallet';

const admins = [
  'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt', // d
  'kujira1xgq5meypfxhhepz6htpv9rn848xhqd2dw3gany', // a
  'kujira1a0uqtx4erytfy2hgeysccjqusrz8ygq9ssjj0p', // f
  'kujira1y4k0re9q905nvvcvvmxug3sqtd9e7du4709d0t', // j
  'kujira1mumzgqekvhvn9fkzj8tajen0qw9j7lj25r2qlk', // n
  'kujira18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfherdpm', // s
  'kujira1wsj79nhlfvcw75hfejh7nt9sy66qyvp3td5zu9', // t
  'osmo13zatchjvrqvtkg2asfxnjmnsur3e7fasmgydqn', // d
  'osmo18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfw2j96r', // s
  'osmo1xgq5meypfxhhepz6htpv9rn848xhqd2dhze4gu', // a
  'osmo1y4k0re9q905nvvcvvmxug3sqtd9e7du48u595n', // j
  'osmo1mumzgqekvhvn9fkzj8tajen0qw9j7lj2dsmgyw', // n
  'osmo1a0uqtx4erytfy2hgeysccjqusrz8ygq9frr65e', // f
  '0xfc0b5423c193953e55446aa75d24c167620f293a', // d
];

export function isAddressAdmin(address: string | undefined | null) {
  return !isNil(address) && admins.includes(address);
}

const adminPages = ['/admin', '/stats-and-totals', '/experimental-features'];

export function useAdmin() {
  const { address } = useWallet();
  const router = useRouter();
  return {
    isAdmin: isAddressAdmin(address),
    isAdminPage: adminPages.includes(router.pathname),
  };
}
