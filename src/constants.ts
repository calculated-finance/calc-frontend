import { NETWORK } from 'kujira.js';

// Environment specific constants
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c';
export const STAKING_ROUTER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_ROUTER_CONTRACT_ADDRESS ||
  'kujira1n2jm3jrjzztjvdljwh549m8zx6w5v59svvta5kkysf5znr40af8qu0vpca';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://test-rpc-kujira.mintthemoon.xyz';
export const CHAIN_ID = (process.env.NEXT_PUBLIC_CHAIN_ID as NETWORK) || 'harpoon-4';
export const FEE_TAKER_ADDRESS =
  process.env.NEXT_PUBLIC_FEE_TAKER_ADDRESS || 'kujira1tn65m5uet32563jj3e2j3wxshht960znv64en0';

export const HOTJAR_SITE_ID = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;

export const LAUNCHDARKLY_SDK_CLIENT_SIDE_ID = '63928928a029f71140f60625';
// Generic constants (not environment specific)
export const CREATE_VAULT_FEE = 0.1; // 10c
export const CANCEL_VAULT_FEE = 0.5; // $1
export const ONE_MILLION = 1000000;
export const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3';
export const SWAP_FEE = 0.01;
export const DELEGATION_FEE = 0.0;
export const FIN_TAKER_FEE = 0.0015;

export const OUT_OF_GAS_ERROR_MESSAGE = 'The transaction ran out of gas during execution. Please provide more gas.';
export const PREVIOUS_SWAP_FAILED_DUE_TO_SLIPPAGE_ERROR_MESSAGE =
  'The previous swap failed due to slippage being exceeded - your funds are safe, and the next swap is scheduled.';
export const PREVIOUS_SWAP_FAILED_DUE_TO_INSUFFICIENT_FUNDS_ERROR_MESSAGE =
  'The previous swap failed and this strategy has moved to complete. This is likely due to a swap amount that is too small to be swapped without losing a large part of the funds to gas. Please cancel the vault to get your remaining funds back.';
export const LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE =
  'Sorry, but we are waiting for CosmWasm Version 0.47 before Ledger supports AuthZ staking to your wallet. This is estimated to be early Jan 2023. You can still auto-stake but without a Ledger or remove the auto-staking option from this strategy and your Ledger will work.';

export const CALC_TELEGRAM_URL = 'https://t.me/calcprotocol';

export const KADO_API_KEY = '020c6cde-5eed-4c46-aa27-e75c40b519e6';

export const DCA_PLUS_MIN_SWAP_COEFFICIENT = 4;

export const MIN_DCA_PLUS_STRATEGY_DURATION = 30;
export const MAX_DCA_PLUS_STRATEGY_DURATION = 365;

export const featureFlags =
  CHAIN_ID === 'kaiyo-1'
    ? {
        extraTimeOptions: true,
        squidIntegrationEnabled: true,
        stationEnabled: false,
        dcaPlusEnabled: true,
      }
    : {
        extraTimeOptions: true,
        squidIntegrationEnabled: true,
        stationEnabled: false,
        dcaPlusEnabled: true,
      };

export const DEFAULT_PAGE_SIZE = 1000;

export const contentData = {
  dcaIn: {
    assets: {
      title: 'Choose Funding & Assets',
      footerText: 'Can I set up recurring deposits?',
    },
    customise: {
      title: 'Customise Strategy',
    },
  },
};
