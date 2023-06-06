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
  {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: 'kujiratestwallet',
      toAddress: 'kujira1tn65m5uet32563jj3e2j3wxshht960znv64en0',
      amount: [
        {
          amount: '200000',
          denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
        },
      ],
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
