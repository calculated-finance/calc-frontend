// usewhitelist

import { useWallet } from '@hooks/useWallet';

const whitelist = [
  'kujira1cwxyae7vgm0cwh4nv3emv5pfv2asm3gm00ewsu', // lb
  'kujira1fecyhermspcr4ty9r8tv6shxpf46xnvf8vpruf', // ca
  'kujira15f6902r2grnzzj7qnsumm0yetfa4rxy24eevzp', // crush
  'kujira16zpu90qdefuhfnhp5epax6xxq435j6at30jkck', // dn
];

export function isAddressWhitelisted(address: string | undefined | null) {
  return address && whitelist.includes(address);
}

export default function useWhitelist() {
  const { address } = useWallet();

  return {
    isWhitelisted: isAddressWhitelisted(address),
  };
}
