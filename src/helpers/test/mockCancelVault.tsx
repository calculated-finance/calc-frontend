// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { encode } from '../encode';

const defaultMsg = {
  cancel_vault: {
    vault_id: '1',
  },
};

const msgs = [
  {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: {
      sender: 'kujiratestwallet',
      contract: CONTRACT_ADDRESS,
      msg: encode(defaultMsg),
      funds: [],
    },
  },
];

export function mockCancelVault(success = true) {
  const cancelSpy = jest.fn();
  if (success) {
    when(cancelSpy).expectCalledWith('kujiratestwallet', msgs, 'auto').mockResolvedValueOnce({});
  } else {
    when(cancelSpy).expectCalledWith('kujiratestwallet', msgs, 'auto').mockRejectedValueOnce(new Error('test reason'));
  }
  return cancelSpy;
}
