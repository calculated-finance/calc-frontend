import { ChainId } from '@hooks/useChainId/Chains';

export const HOTJAR_SITE_ID = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;

// Generic constants (not environment specific)
export const CREATE_VAULT_FEE = 0.1; // 10c
export const CANCEL_VAULT_FEE = 0.5; // $1
export const ONE_MILLION = 1000000;
export const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3';
export const SWAP_FEE = 0.005;
export const SWAP_FEE_WS = 0.01;
export const DELEGATION_FEE = 0.0;
export const FIN_TAKER_FEE = 0.0015;
export const MINIMUM_SWAP_VALUE_IN_USD = 0.5;

export const OUT_OF_GAS_ERROR_MESSAGE = 'The transaction ran out of gas during execution. Please provide more gas.';
export const PREVIOUS_SWAP_FAILED_DUE_TO_SLIPPAGE_ERROR_MESSAGE =
  'The previous swap failed due to slippage or price impact being exceeded - your funds are safe, and the next swap is scheduled. You can edit the slippage settings at anytime.';
export const PREVIOUS_SWAP_FAILED_DUE_TO_INSUFFICIENT_FUNDS_ERROR_MESSAGE =
  'The previous swap failed and this strategy has moved to complete. This is likely due to a swap amount that is too small to be swapped without losing a large part of the funds to gas. Please cancel the vault to get your remaining funds back.';
export const LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE =
  'Sorry, but we are waiting for CosmWasm Version 0.47 before Ledger supports AuthZ staking to your wallet. This is estimated to be early Jan 2023. You can still auto-stake but without a Ledger or remove the auto-staking option from this strategy and your Ledger will work.';
export const TRANSACTION_INDEXING_DISABLED_ERROR_MESSAGE =
  "It's likely that your strategy has already been created, please check before trying again.";

export const CALC_TELEGRAM_URL = 'https://t.me/calcprotocol';

export const KADO_API_KEY = '020c6cde-5eed-4c46-aa27-e75c40b519e6';

export const DCA_PLUS_MIN_SWAP_COEFFICIENT = 4;

export const SIMPLIFIED_DCA_SLIPPAGE_TOLERANCE = 0.75;

export const MIN_DCA_PLUS_STRATEGY_DURATION = 30;
export const MAX_DCA_PLUS_STRATEGY_DURATION = 365;

export const MIN_OVER_COLLATERALISED = 0.8;
export const MAX_OVER_COLLATERALISED = 2.5;
export const RECOMMENDED_OVER_COLLATERALISED = 1.2;

export const SECONDS_IN_A_HOUR = 3600;
export const SECONDS_IN_A_DAY = 86400;
export const SECONDS_IN_A_WEEK = 604800;

export const DAYS_IN_A_WEEK = 7;
export const HOURS_IN_A_DAY = 24;
export const MINUTES_IN_A_HOUR = 60;
export const SECONDS_IN_A_MINUTE = 60;

export const COIN_DECIMAL_LIMIT = 6;
export const COIN_DECIMAL_LIMIT_TO_SHOW_2_DECIMALS = 1;

export const COSMOS_KIT_KUJIRA_MAINNET = 'kujira';
export const COSMOS_KIT_KUJIRA_TESTNET = 'kujiratestnet';
export const COSMOS_KIT_OSMOSIS_MAINNET = 'osmosis';
export const COSMOS_KIT_OSMOSIS_TESTNET = 'osmosistestnet';

export const ETH_DCA_FACTORY_CONTRACT_ADDRESS = '0x8c7877a15DEad1732e33d4756899CD13bC61d0BD';

export const ETH_DCA_EVENT_MANAGER_ADDRESS = '0xFEbc484b5381a9606fBD12a737978442D34CD0A5';

export const ETH_TIME_HELPERS_CONTRACT_ADDRESS = '0x296303bA819CAed9C1151d24bAc93651DAD1009B';
export const ETH_TRIGGER_MANAGER_CONTRACT_ADDRESS = '0x0451ABE786ADDce2C62393127C55F3EC640A33B1';
export const ETH_SWAPPER_CONTRACT_ADDRESS = '0xd0f4E9e74346A3D66B29C5cDa2ea36eC3f6147cC';

export const featureFlags =
  process.env.NEXT_PUBLIC_APP_ENV === 'production'
    ? {
        singleAssetsEnabled: false,
      }
    : {
        singleAssetsEnabled: true,
      };

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
  streamingSwap: {
    assets: {
      title: 'Streaming Swap',
    },
  },
};

export const CHAINS = ['kaiyo-1', 'harpoon-4', 'osmosis-1', 'osmo-test-5'] as ChainId[];
export const MAINNET_CHAINS = ['kaiyo-1', 'osmosis-1'] as ChainId[];
export const KUJIRA_CHAINS = ['kaiyo-1', 'harpoon-4'] as ChainId[];
export const OSMOSIS_CHAINS = ['osmosis-1', 'osmo-test-5'] as ChainId[];

export const OSMOSIS_MAINNET_RPC = 'https://rpc-osmosis.goldenratiostaking.net/';
export const OSMOSIS_TESTNET_RPC = 'https://rpc.osmotest5.osmosis.zone/';
export const KUJIRA_MAINNET_RPC = 'https://kujira-rpc.nodes.defiantlabs.net';
export const KUJIRA_TESTNET_RPC = 'https://kujira-testnet-rpc.polkachu.com/';
