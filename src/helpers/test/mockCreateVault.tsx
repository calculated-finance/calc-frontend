// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import mockStrategyData from 'src/fixtures/strategy';
import { Strategy } from '@hooks/useStrategies';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { CONTRACT_ADDRESS } from 'src/constants';
import { encode } from '../encode';

export function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}
const defaultExecuteMsg: ExecuteMsg = {
  create_vault: {
    label: '',
    time_interval: 'daily',
    target_denom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
    swap_amount: '1000000',
    slippage_tolerance: '0.02',
  },
};

const defaultMsgs = [
  {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: {
      contract: CONTRACT_ADDRESS,
      funds: [
        { amount: '1000000', denom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk' },
      ],
      msg: encode(defaultExecuteMsg),
      sender: 'kujitestwallet',
    },
  },
  {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      amount: [
        { amount: '28571', denom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk' },
      ],
      fromAddress: 'kujitestwallet',
      toAddress: 'kujira1tn65m5uet32563jj3e2j3wxshht960znv64en0',
    },
  },
];

export function mockCreateVault(msgs = defaultMsgs) {
  const queryContractSmart = jest.fn();
  when(queryContractSmart)
    .expectCalledWith('kujitestwallet', msgs, 'auto')
    .mockResolvedValueOnce({
      logs: [
        {
          msg_index: 0,
          log: '',
          events: [
            {
              type: 'coin_received',
              attributes: [
                {
                  key: 'receiver',
                  value: CONTRACT_ADDRESS,
                },
                {
                  key: 'amount',
                  value: '1000000factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                },
              ],
            },
            {
              type: 'coin_spent',
              attributes: [
                {
                  key: 'spender',
                  value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
                },
                {
                  key: 'amount',
                  value: '1000000factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                },
              ],
            },
            {
              type: 'execute',
              attributes: [
                {
                  key: '_contract_address',
                  value: CONTRACT_ADDRESS,
                },
              ],
            },
            {
              type: 'message',
              attributes: [
                {
                  key: 'action',
                  value: '/cosmwasm.wasm.v1.MsgExecuteContract',
                },
                {
                  key: 'module',
                  value: 'wasm',
                },
                {
                  key: 'sender',
                  value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
                },
              ],
            },
            {
              type: 'transfer',
              attributes: [
                {
                  key: 'recipient',
                  value: CONTRACT_ADDRESS,
                },
                {
                  key: 'sender',
                  value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
                },
                {
                  key: 'amount',
                  value: '1000000factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                },
              ],
            },
            {
              type: 'wasm',
              attributes: [
                {
                  key: '_contract_address',
                  value: CONTRACT_ADDRESS,
                },
                {
                  key: 'method',
                  value: 'create_vault',
                },
                {
                  key: 'owner',
                  value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
                },
                {
                  key: 'vault_id',
                  value: '59',
                },
              ],
            },
          ],
        },
      ],
      height: 5135625,
      transactionHash: '7A257B74D83E083E3123A45C98E4C51A7FA6E6999F03F6E2B6482EB0AFFDC1E8',
      events: [
        {
          type: 'coin_spent',
          attributes: [
            {
              key: 'spender',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
            {
              key: 'amount',
              value: '987ukuji',
            },
          ],
        },
        {
          type: 'coin_received',
          attributes: [
            {
              key: 'receiver',
              value: 'kujira17xpfvakm2amg962yls6f84z3kell8c5lp3pcxh',
            },
            {
              key: 'amount',
              value: '987ukuji',
            },
          ],
        },
        {
          type: 'transfer',
          attributes: [
            {
              key: 'recipient',
              value: 'kujira17xpfvakm2amg962yls6f84z3kell8c5lp3pcxh',
            },
            {
              key: 'sender',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
            {
              key: 'amount',
              value: '987ukuji',
            },
          ],
        },
        {
          type: 'message',
          attributes: [
            {
              key: 'sender',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
          ],
        },
        {
          type: 'tx',
          attributes: [
            {
              key: 'fee',
              value: '987ukuji',
            },
            {
              key: 'fee_payer',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
          ],
        },
        {
          type: 'tx',
          attributes: [
            {
              key: 'acc_seq',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt/325',
            },
          ],
        },
        {
          type: 'tx',
          attributes: [
            {
              key: 'signature',
              value: 'X0PT8jZo++6cTg+k7RbMWn+0y3MAutZqUKPM+f4aFQZ/2/iNjdpq6JTFu9+kZV7EGIJlBvwtCN1Y95gWFiEhNQ==',
            },
          ],
        },
        {
          type: 'message',
          attributes: [
            {
              key: 'action',
              value: '/cosmwasm.wasm.v1.MsgExecuteContract',
            },
          ],
        },
        {
          type: 'message',
          attributes: [
            {
              key: 'module',
              value: 'wasm',
            },
            {
              key: 'sender',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
          ],
        },
        {
          type: 'coin_spent',
          attributes: [
            {
              key: 'spender',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
            {
              key: 'amount',
              value: '1000000factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
            },
          ],
        },
        {
          type: 'coin_received',
          attributes: [
            {
              key: 'receiver',
              value: CONTRACT_ADDRESS,
            },
            {
              key: 'amount',
              value: '1000000factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
            },
          ],
        },
        {
          type: 'transfer',
          attributes: [
            {
              key: 'recipient',
              value: CONTRACT_ADDRESS,
            },
            {
              key: 'sender',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
            {
              key: 'amount',
              value: '1000000factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
            },
          ],
        },
        {
          type: 'execute',
          attributes: [
            {
              key: '_contract_address',
              value: CONTRACT_ADDRESS,
            },
          ],
        },
        {
          type: 'wasm',
          attributes: [
            {
              key: '_contract_address',
              value: CONTRACT_ADDRESS,
            },
            {
              key: 'method',
              value: 'create_vault',
            },
            {
              key: 'owner',
              value: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
            },
            {
              key: 'vault_id',
              value: '59',
            },
          ],
        },
      ],
      gasWanted: 394519,
      gasUsed: 317777,
    });
  return queryContractSmart;
}
