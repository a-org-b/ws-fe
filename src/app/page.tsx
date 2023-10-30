"use client";
import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chains, wagmiClient } from "@/wallet-config";
import { WagmiConfig, usePublicClient, useWalletClient } from "wagmi";
import { get_mint, prepare_mint } from "@/services/smartcontract/prepare_mint";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NewCard } from "../components/NewCard";

interface Transaction {
  transaction_hash: string;
  blockNumber: number;
  blockTimestamp: string;
  value: string;
  contractAddress: string;
}

interface NFT {
  NFTCount: number;
  imageURI: string;
  name: string;
  value: string;
}
export default function Home() {
  const pbClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [chainIdInput, setChainIdInput] = useState<string>("");
  const [addressInput, setAddressInput] = useState<string>("");
  const [apiResponseData, setApiResponseData] = useState<Transaction[] | null>(
    null
  );
  const [apiNFTResponseData, setApiNFTResponseData] = useState<NFT[] | null>(
    null
  );
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [NFTCountState, setNFTCountState] = useState<number>(0);
  const [totalTransactionValue, setTotalTransactionValue] = useState<number>(0);
  const [mintsLeft, setMintsLeft] = useState("");

  useEffect(() => {
    if (!pbClient || !walletClient) return;
    get_mint(pbClient, walletClient.account.address)
      .then((e) => e?.toString())
      .then((e) => {
        if (e) {
          setMintsLeft(e);
          9;
        }
      });
  }, [pbClient, walletClient]);

  const transactionsAPICall = (): void => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_CHAINBASE_API_KEY,
      },
    };

    const apiUrl = `https://api.chainbase.online/v1/account/txs?chain_id=${chainIdInput}&address=${addressInput}&page=1&limit=20`;

    axios
      .get(apiUrl, options)
      .then((response: AxiosResponse<any>) => {
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setApiResponseData(response.data.data);
          let count = response.data.count;
          let valueSum = 0;
          response.data.data.forEach((item: Transaction) => {
            valueSum += parseInt(item.value);
          });
          valueSum /= 1000000;
          valueSum += count;
          setTotalTransactionValue(valueSum);
        } else {
          console.error("Invalid response format.");
        }
      })
      .catch((error: any) => console.error(error));
  };

  const NFTAPICall = (): void => {
    const options: AxiosRequestConfig = {
      headers: {
        accept: "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_CHAINBASE_API_KEY,
      },
    };

    const url: string = `https://api.chainbase.online/v1/account/nfts?chain_id=${chainIdInput}&address=${addressInput}&page=1&limit=20`;

    axios
      .get(url, options)
      .then((response: AxiosResponse<any>) => {
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          let NFTCount = response.data.count;
          setApiNFTResponseData(response.data.data);
          setNFTCountState(NFTCount);
          console.log(apiNFTResponseData);
        } else {
          console.error("Invalid response format.");
        }
      })
      .catch((error: any) => console.error(error));
  };

  const handleButtonClick = () => {
    transactionsAPICall();
    NFTAPICall();
  };

  return (
    <RainbowKitProvider chains={Chains}>
      <header>
        <ConnectButton />
        {walletClient && (
          <button
            className="bg-green-900 text-white rounded-sm px-4 py-2"
            onClick={() => prepare_mint(pbClient, walletClient)}
          >
            hii
          </button>
        )}
        {walletClient && <p>{mintsLeft}</p>}
      </header>
      <main className="p-24">
        <div className="bg-gray-100 p-10">
          <div className="max-w-md mx-auto bg-white p-5 rounded shadow-md">
            <label
              htmlFor="chainIdInput"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Chain ID:
            </label>
            <input
              type="text"
              id="chainIdInput"
              className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300"
              placeholder="Enter chain ID"
              value={chainIdInput}
              onChange={(e) => setChainIdInput(e.target.value)}
            />
            <label
              htmlFor="addressInput"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Address:
            </label>
            <input
              type="text"
              id="addressInput"
              className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300"
              placeholder="Enter address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              onClick={handleButtonClick}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Make API Call
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-10 bg-slate-100">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <NewCard
                allTransactions={apiResponseData}
                address={addressInput}
                value={totalTransactionValue}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NFT</CardTitle>
            </CardHeader>
            <CardContent>
              <NewCard NFTransaction={apiNFTResponseData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <NewCard />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <NewCard />
            </CardContent>
          </Card>
        </div>
      </main>
    </RainbowKitProvider>
  );
}
