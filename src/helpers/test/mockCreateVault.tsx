// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import mockStrategyData from 'src/fixtures/strategy';
import { Strategy } from '@hooks/useStrategies';

export function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}

const defaultMsg = {
  create_vault: {
    destinations: undefined,
    label: '',
    pair_address: 'kujira12cks8zuclf9339tnanpdd8z8ycf5ygdgy885sejc7kyhvryzfyzsvjpasw',
    position_type: 'enter',
    slippage_tolerance: undefined,
    swap_amount: '1000000',
    target_price: undefined,
    target_start_time_utc_seconds: undefined,
    time_interval: 'daily',
  },
};

const defaultFunds = [
  { amount: '1000000', denom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk' },
];

export function mockCreateVault(msg = defaultMsg, funds = defaultFunds) {
  const queryContractSmart = jest.fn();
  when(queryContractSmart)
    .calledWith('kujitestwallet', CONTRACT_ADDRESS, msg, 'auto', undefined, funds)
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
                  value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
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
                  value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
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
                  value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
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
                  value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
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
              value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
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
              value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
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
              value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
            },
          ],
        },
        {
          type: 'wasm',
          attributes: [
            {
              key: '_contract_address',
              value: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
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
