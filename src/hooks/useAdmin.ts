// usewhitelist

import { isNil } from 'lodash';
import { useRouter } from 'next/router';
import { useWallet } from '@hooks/useWallet';

const admins = [
  'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
  'kujira1xgq5meypfxhhepz6htpv9rn848xhqd2dw3gany',
  'kujira1a0uqtx4erytfy2hgeysccjqusrz8ygq9ssjj0p',
  'kujira1y4k0re9q905nvvcvvmxug3sqtd9e7du4709d0t',
  'kujira1mumzgqekvhvn9fkzj8tajen0qw9j7lj25r2qlk',
  'kujira18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfherdpm',
  'kujira1wsj79nhlfvcw75hfejh7nt9sy66qyvp3td5zu9',
  'osmo13zatchjvrqvtkg2asfxnjmnsur3e7fasmgydqn',
  'osmo18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfw2j96r',
  'osmo1xgq5meypfxhhepz6htpv9rn848xhqd2dhze4gu',
  'osmo1y4k0re9q905nvvcvvmxug3sqtd9e7du48u595n',
  'osmo1mumzgqekvhvn9fkzj8tajen0qw9j7lj2dsmgyw',
  'osmo1a0uqtx4erytfy2hgeysccjqusrz8ygq9frr65e',
  '0xfc0b5423c193953e55446aa75d24c167620f293a',
  '0x1Af6fca482cD73c198b8C0f3C883be8d9Bf5cF74',
  'archway1y4k0re9q905nvvcvvmxug3sqtd9e7du46vm3gk',
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
