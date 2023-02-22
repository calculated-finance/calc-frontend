/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import { Keplr as WindowKeplr } from '@keplr-wallet/types';
import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/stargate';
import { CHAIN_INFO } from 'kujira.js';

import {
  WalletName,
  BaseSignerWalletAdapter,
  WalletReadyState,
  scopePollingDetectionStrategy,
  WalletNotReadyError,
  WalletConnectionError,
  WalletAccountError,
  WalletPublicKeyError,
  WalletDisconnectionError,
  WalletNotConnectedError,
  WalletError,
  WalletSendTransactionError,
  WalletSignTransactionError,
  WalletDisconnectedError,
} from '@wizard-ui/core';
import { CHAIN_ID } from 'src/constants';
import { ConnectedWallet, ConnectType, WalletController } from '@terra-money/wallet-controller';
import { getController } from './_app.page';

interface StationWallet extends SigningCosmWasmClient {
  address?: any;
  signTransaction({
    signerAddress,
    messages,
    fee,
    memo,
  }: {
    signerAddress: string;
    messages: EncodeObject[];
    fee: StdFee;
    memo: string;
  }): Promise<any>;
  signAndSendTransaction({
    signerAddress,
    messages,
    fee,
    memo,
  }: {
    signerAddress: string;
    messages: EncodeObject[];
    fee: number | StdFee | 'auto';
    memo?: string;
  }): Promise<{ signature: any }>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

interface KeplrWindow extends Window {
  keplr?: WindowKeplr;
}

declare const window: KeplrWindow;

export interface StationWalletAdapterConfig {
  endpoint: string;
  chainId: string;
  options?: SigningCosmWasmClientOptions;
}

export const StationWalletName = 'Station Wallet' as WalletName;

export class StationWalletAdapter extends BaseSignerWalletAdapter {
  name = StationWalletName;

  url = 'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap';

  icon = 'station icon';

  private _connecting: boolean;

  private _wallet: StationWallet | null;

  private _options: SigningCosmWasmClientOptions | undefined;

  private _chainId: string;

  private _endpoint: string;

  private _address: any | null;

  private _readyState: WalletReadyState =
    typeof window === 'undefined' || typeof document === 'undefined'
      ? WalletReadyState.Unsupported
      : WalletReadyState.NotDetected;

  constructor(config: StationWalletAdapterConfig) {
    super();
    this._connecting = false;
    this._wallet = null;
    this._address = null;
    this._chainId = config.chainId;
    this._endpoint = config.endpoint;
    this._options = config.options;

    if (this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        if (window?.keplr) {
          this._readyState = WalletReadyState.Installed;
          this.emit('readyStateChange', this._readyState);
          return true;
        }
        return false;
      });
    }
  }

  get address(): any | null {
    return this._address;
  }

  get connecting(): boolean {
    return this._connecting;
  }

  get connected(): boolean {
    return !!this._address;
  }

  get readyState(): WalletReadyState {
    return this._readyState;
  }

  public signAndBroadcast = async (msgs: EncodeObject[]): Promise<DeliverTxResponse> => {
    const terraMsgs = msgs.map((m) => Msg.fromProto({ typeUrl: m.typeUrl, value: registry.encode(m) }));

    const res = await this.controller.sign({
      msgs: terraMsgs,
      chainID: this.config.chainId,
    });

    const stargate = await StargateClient.connect(this.config.rpc);
    const result = await stargate.broadcastTx(res.result.toBytes());
    return result;
  };

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (this._readyState !== WalletReadyState.Installed) throw new WalletNotReadyError();

      this._connecting = true;

      // const wallet = null;
      const accounts = null;

      const config = CHAIN_INFO[CHAIN_ID];

      // try {
      //   await window.keplr!.experimentalSuggestChain({
      //     ...config,
      //     // Keplr is bullshti and defaults to the first of these provided as the fee denom
      //     feeCurrencies: config.feeCurrencies.filter((x) => x.coinMinimalDenom === 'ukuji'),
      //   });
      //   await window.keplr!.enable(this._chainId);

      //   const offlineSigner = await window.keplr!.getOfflineSignerAuto(this._chainId);

      //   accounts = await offlineSigner.getAccounts();

      //   // Initialize the gaia api with the offline signer that is injected by Keplr extension.
      //   wallet = await SigningCosmWasmClient.connectWithSigner(this._endpoint, offlineSigner, this._options);
      // } catch (error: any) {
      //   throw new WalletConnectionError(error?.message, error);
      // }
      // if (accounts.length === 0) throw new WalletAccountError();

      let address: any;
      // try {
      //   address = accounts[0].address;
      // } catch (error: any) {
      //   throw new WalletPublicKeyError(error?.message, error);
      // }

      // this._wallet = wallet as StationWallet;
      // this._address = address;

      const controller = getController();

      console.log('controller', controller);

      await controller.connect(ConnectType.EXTENSION);

      const wallet: ConnectedWallet = await new Promise((r) =>
        controller.connectedWallet().subscribe((next) => {
          next && r(next);
        }),
      );

      console.log(wallet);

      this._address = wallet.addresses[CHAIN_INFO['kaiyo-1'].chainId];

      // we need to take what we've got and get a signing client now (SigningCosmWasmClient)

      this._wallet = { signAndBroadcast: this.signAndBroadcast };

      this.emit('connect', address);
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    if (wallet) {
      // wallet.off("disconnect", this._disconnected);

      this._wallet = null;
      this._address = null;

      try {
        await wallet.disconnect();
      } catch (error: any) {
        this.emit('error', new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit('disconnect');
  }

  async sendTransaction({
    signerAddress,
    messages,
    fee,
    memo,
  }: {
    signerAddress: string;
    messages: EncodeObject[];
    fee: number | StdFee | 'auto';
    memo?: string;
  }): Promise<any> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        return await wallet.signAndBroadcast(signerAddress, messages, fee, memo);
      } catch (error: any) {
        if (error instanceof WalletError) throw error;
        throw new WalletSendTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signTransaction({
    signerAddress,
    messages,
    fee,
    memo,
  }: {
    signerAddress: string;
    messages: EncodeObject[];
    fee: StdFee;
    memo: string;
  }): Promise<any> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        return await wallet.sign(signerAddress, messages, fee, memo);
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  private _disconnected = () => {
    const wallet = this._wallet;
    if (wallet) {
      // wallet.off("disconnect", this._disconnected);

      this._wallet = null;
      this._address = null;

      this.emit('error', new WalletDisconnectedError());
      this.emit('disconnect');
    }
  };
}
