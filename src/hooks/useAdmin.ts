import { useRouter } from 'next/router';
import { useWallet } from '@hooks/useWallet';

const admins = {
  kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
  kujira1xgq5meypfxhhepz6htpv9rn848xhqd2dw3gany: 'kujira1xgq5meypfxhhepz6htpv9rn848xhqd2dw3gany',
  kujira1a0uqtx4erytfy2hgeysccjqusrz8ygq9ssjj0p: 'kujira1a0uqtx4erytfy2hgeysccjqusrz8ygq9ssjj0p',
  kujira1y4k0re9q905nvvcvvmxug3sqtd9e7du4709d0t: 'kujira1y4k0re9q905nvvcvvmxug3sqtd9e7du4709d0t',
  kujira1mumzgqekvhvn9fkzj8tajen0qw9j7lj25r2qlk: 'kujira1mumzgqekvhvn9fkzj8tajen0qw9j7lj25r2qlk',
  kujira18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfherdpm: 'kujira18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfherdpm',
  kujira1wsj79nhlfvcw75hfejh7nt9sy66qyvp3td5zu9: 'kujira1wsj79nhlfvcw75hfejh7nt9sy66qyvp3td5zu9',
  osmo13zatchjvrqvtkg2asfxnjmnsur3e7fasmgydqn: 'osmo13zatchjvrqvtkg2asfxnjmnsur3e7fasmgydqn',
  osmo18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfw2j96r: 'osmo18gwmpc4dlk7ntzl8tx0pzcu3vkd8veyfw2j96r',
  osmo1xgq5meypfxhhepz6htpv9rn848xhqd2dhze4gu: 'osmo1xgq5meypfxhhepz6htpv9rn848xhqd2dhze4gu',
  osmo1y4k0re9q905nvvcvvmxug3sqtd9e7du48u595n: 'osmo1y4k0re9q905nvvcvvmxug3sqtd9e7du48u595n',
  osmo1mumzgqekvhvn9fkzj8tajen0qw9j7lj2dsmgyw: 'osmo1mumzgqekvhvn9fkzj8tajen0qw9j7lj2dsmgyw',
  osmo1a0uqtx4erytfy2hgeysccjqusrz8ygq9frr65e: 'osmo1a0uqtx4erytfy2hgeysccjqusrz8ygq9frr65e',
  archway1y4k0re9q905nvvcvvmxug3sqtd9e7du46vm3gk: 'archway1y4k0re9q905nvvcvvmxug3sqtd9e7du46vm3gk',
  neutron1y4k0re9q905nvvcvvmxug3sqtd9e7du4tcwhcx: 'neutron1y4k0re9q905nvvcvvmxug3sqtd9e7du4tcwhcx',
};

export const isAddressAdmin = (address: string | undefined | null) => address && address in admins;

const adminPages = ['/admin', '/stats-and-totals', '/experimental-features'];

export const useAdmin = () => ({
  isAdmin: isAddressAdmin(useWallet().address),
  isAdminPage: adminPages.includes(useRouter().pathname),
});
