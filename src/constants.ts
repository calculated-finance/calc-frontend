import { NETWORK } from 'kujira.js';

// Environment specific constants
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'kujira1hvfe75f6gsse9jh3r02zy4e6gl8fg7r4ktznwwsg94npspqkcm8stq56d7';
export const STAKING_ROUTER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_ROUTER_CONTRACT_ADDRESS ||
  'kujira1n2jm3jrjzztjvdljwh549m8zx6w5v59svvta5kkysf5znr40af8qu0vpca';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://kujira-testnet-rpc.polkachu.com/';

export const OSMOSIS_RPC_ENDPOINT_MAINNET =
  process.env.NEXT_PUBLIC_OSMOSIS_RPC_ENDPOINT_MAINNET || 'https://osmosis-rpc.polkachu.com/';
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

export const ETH_DCA_FACTORY_CONTRACT_ADDRESS = '0x8c7877a15DEad1732e33d4756899CD13bC61d0BD';

export const ETH_DCA_EVENT_MANAGER_ADDRESS = '0xFEbc484b5381a9606fBD12a737978442D34CD0A5';

export const ETH_TIME_HELPERS_CONTRACT_ADDRESS = '0x296303bA819CAed9C1151d24bAc93651DAD1009B';
export const ETH_TRIGGER_MANAGER_CONTRACT_ADDRESS = '0x0451ABE786ADDce2C62393127C55F3EC640A33B1';
export const ETH_SWAPPER_CONTRACT_ADDRESS = '0xd0f4E9e74346A3D66B29C5cDa2ea36eC3f6147cC';

export const featureFlags =
  CHAIN_ID === 'kaiyo-1'
    ? {
        extraTimeOptions: true,
        squidIntegrationEnabled: true,
        stationEnabled: false,
        leapEnabled: false,
        XDEFIEnabled: true,
        dcaPlusEnabled: true,
        reinvestVisualsEnabled: true,
        isKujiraV2Enabled: true,
        customTimeIntervalEnabled: true,
        amplitudeEnabled: true,
        learningHubEnabled: true,
        unconnectedFirstStepEnabled: true,
        getFundsModalEnabled: true,
        assetPageStrategyButtonsEnabled: true,
        adjustedMinimumSwapAmountEnabled: true,
        controlDeskEnabled: false,
        editSwapAmountEnabled: true,
        singleAssetsEnabled: false,
      }
    : {
        extraTimeOptions: true,
        reinvestVisualsEnabled: true,
        squidIntegrationEnabled: true,
        stationEnabled: false,
        leapEnabled: true,
        XDEFIEnabled: false,
        dcaPlusEnabled: true,
        isKujiraV2Enabled: true,
        customTimeIntervalEnabled: true,
        amplitudeEnabled: false,
        learningHubEnabled: true,
        unconnectedFirstStepEnabled: true,
        getFundsModalEnabled: true,
        assetPageStrategyButtonsEnabled: true,
        adjustedMinimumSwapAmountEnabled: true,
        controlDeskEnabled: true,
        editSwapAmountEnabled: true,
        singleAssetsEnabled: true,
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
