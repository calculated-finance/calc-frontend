import { useEffect, useState } from "react";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { AccountData, EncodeObject } from "@cosmjs/proto-signing";
import {
  SigningStargateClient,
  GasPrice,
  DeliverTxResponse,
} from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";

import { useNetwork } from "..";
import {
  registry,
  aminoTypes,
  CHAIN_INFO,
  MAINNET,
  NETWORK,
} from "kujira.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export type UseKeplr = {
  connect: null | ((chain?: string) => void);
  disconnect: () => void;
  account: AccountData | null;
  signAndBroadcast: (
    msgs: EncodeObject[]
  ) => Promise<DeliverTxResponse>;
};

export const useKeplr = ({
  feeDenom,
}: {
  feeDenom: string;
}): UseKeplr => {
  const [{ network, chainInfo }, setNetwork] = useNetwork();

  const [accounts, setAccounts] = useState<
    null | readonly AccountData[]
  >(null);
  const keplr = window.keplr;

  const connect = (network: string = MAINNET) => {
    if (!keplr) return;

    const config = CHAIN_INFO[network];
    keplr
      .experimentalSuggestChain({
        ...config,
        // Keplr is bullshti and defaults to the first of these provided as the fee denom
        feeCurrencies: config.feeCurrencies.filter(
          (x) => x.coinMinimalDenom === feeDenom
        ),
      })
      .then(() => keplr.enable(network))
      .then(() => keplr.getOfflineSignerAuto(network))
      .then((signer) => signer.getAccounts())
      .then((as) => {
        document.cookie = "keplr=connected; path=/";
        setNetwork(network as NETWORK);
        setAccounts(as);
      });
  };

  useEffect(() => {
    const stored = document.cookie.includes("keplr=connected");

    if (stored && connect) connect(network);
  }, [keplr]);

  const account = accounts ? accounts[0] : null;

  useEffect(() => {
    window.addEventListener("keplr_keystorechange", () => {
      const keplr = window.keplr;
      if (!keplr) return;

      account &&
        keplr
          .getOfflineSignerAuto(network)
          .then((signer) => signer.getAccounts())
          .then(setAccounts);
    });
  }, [account]);

  useEffect(() => {
    if (!account) return;
    const keplr = window.keplr;
    keplr
      ?.experimentalSuggestChain({
        ...chainInfo,
        feeCurrencies: chainInfo.feeCurrencies.filter(
          (x) => x.coinMinimalDenom === feeDenom
        ),
      })
      .then(() => keplr.enable(network));
  }, [account, network, chainInfo]);

  const signAndBroadcast = async (
    msgs: EncodeObject[]
  ): Promise<DeliverTxResponse> => {
    if (!window.keplr || !account)
      throw new Error("No Wallet Connected");

    const signer = await window.keplr.getOfflineSignerAuto(network);
    const gasPrice = new GasPrice(
      Decimal.fromUserInput("0.00125", 18),
      feeDenom
    );

    const client = await SigningStargateClient.connectWithSigner(
      chainInfo.rpc,
      signer,
      {
        registry,
        gasPrice,
        aminoTypes: aminoTypes("kujira"),
      }
    );

    const res = await client.signAndBroadcast(
      account.address,
      msgs,
      1.5
    );

    return res;
  };

  return {
    account,
    connect,
    disconnect: () => {
      document.cookie = "keplr=disconnected;";
      setAccounts(null);
    },
    signAndBroadcast,
  };
};