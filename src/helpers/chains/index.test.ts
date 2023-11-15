import * as isMainnet from '@utils/isMainnet';
import { ChainId } from '@hooks/useChain/Chains';
import { CONTRACT_ADDRESS } from 'src/constants';
import { getChainContractAddress, getRedBankAddress } from '.';

jest.mock('@utils/isMainnet');

describe('getChainContractAddress', () => {
  it('returns the correct address for Osmosis mainnet', () => {
    jest.spyOn(isMainnet, 'isMainnet').mockReturnValue(true);

    const address = getChainContractAddress('osmosis-1');
    expect(address).toEqual('osmo1zacxlu90sl6j2zf90uctpddhfmux84ryrw794ywnlcwx2zeh5a4q67qtc9');
  });

  it('returns the correct address for Osmosis non-mainnet', () => {
    jest.spyOn(isMainnet, 'isMainnet').mockReturnValue(false);

    const address = getChainContractAddress('osmosis-1');
    expect(address).toEqual('osmo1sk0qr7kljlsas09tn8lgh4zfcskwx76p4gypmwtklq2883pun3gs8rhs7f');
  });

  it('returns the correct address for other chains', () => {
    const address = getChainContractAddress('kaiyo-1');
    expect(address).toEqual(CONTRACT_ADDRESS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

describe('getMarsAddress', () => {
  it('returns the correct address for mainnet', () => {
    jest.spyOn(isMainnet, 'isMainnet').mockReturnValue(true);

    const address = getRedBankAddress();
    expect(address).toEqual('osmo1c3ljch9dfw5kf52nfwpxd2zmj2ese7agnx0p9tenkrryasrle5sqf3ftpg');
  });

  it('returns the correct address for non-mainnet', () => {
    jest.spyOn(isMainnet, 'isMainnet').mockReturnValue(false);
    const address = getRedBankAddress();
    expect(address).toEqual('osmo1dl4rylasnd7mtfzlkdqn2gr0ss4gvyykpvr6d7t5ylzf6z535n9s5jjt8u');
  });
});
