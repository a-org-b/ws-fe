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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface Transaction {
  transaction_hash: string;
  blockNumber: number;
  blockTimestamp: string;
  value: string;
  contractAddress: string;
}

interface FloorPrice {
  value?: string;
}

interface NFT {
  NFTCount?: number;
  image_uri?: string;
  name?: string;
  floor_prices?: FloorPrice[] | null;
  metadata: {
    image: string | null;
  };
}

export default function Home() {
  const pbClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [chainIdInput, setChainIdInput] = useState<string>();
  const [addressInput, setAddressInput] = useState<string>("");
  const [apiResponseData, setApiResponseData] = useState<Transaction[] | null>(
    null
  );
  const [apiNFTResponseData, setApiNFTResponseData] = useState<NFT[] | null>(
    null
  );
  const [NFTCountState, setNFTCountState] = useState<number>(0);
  const [totalTransactionValue, setTotalTransactionValue] = useState<number>(0);
  const [totalNFTValue, setTotalNFTValue] = useState<number>(0);
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
          let valueSum: number = 0;
          let totalTransactionVal: number = 0;
          response.data.data.forEach((item: Transaction) => {
            valueSum += +(item.value || "0") / 1000000000000000000;
          });
          totalTransactionVal = valueSum + count * 10;
          console.log(valueSum);
          console.log(totalTransactionVal);
          setTotalTransactionValue(totalTransactionVal);
        } else {
          console.error("Invalid response format.");
        }
      })
      .catch((error: any) => console.error(error));
  };
  const process_img = (i: string) => {
    if (i.startsWith("ipfs://")) {
      return i.replace("ipfs://", "https://nftstorage.link/ipfs/");
    }
    return i;
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
          let NFTCount: number = response.data.count;
          let NFTValue: number = 0;
          let totalNFTVal: number;
          setApiNFTResponseData(response.data.data);
          response.data.data.forEach((item: NFT) => {
            NFTValue += parseInt(item.floor_prices?.[0]?.value || "0");
          });
          setNFTCountState(NFTCount);
          totalNFTVal = NFTValue + NFTCount * 10;
          setTotalNFTValue(totalNFTVal);
        } else {
          console.error("Invalid response format.");
        }
      })
      .catch((error: any) => console.error(error));
  };

  const handleButtonClick = () => {
    transactionsAPICall();
    setTimeout(NFTAPICall, 2000);
  };

  const calculateWalletScore = (): number => {
    return totalNFTValue + totalTransactionValue;
  };

  const handleChainChange = (e: any) => {
    setChainIdInput(e.target.value);
  };
  return (
    <RainbowKitProvider chains={Chains}>
      <header>
        <div className="w-[100vw] flex">
          <div className="my-2 ml-2">
            <ConnectButton />
          </div>
          {walletClient && (
            <div className="flex items-center justify-center flex-col ml-auto">
              <button
                className="bg-green-500 text-white rounded-lg px-4 py-2"
                onClick={() => {
                  if (+mintsLeft > 0)
                    fetch(
                      `/api/mint?address=${
                        walletClient.account.address
                      }&score=${calculateWalletScore()}`
                    );
                  else
                    prepare_mint(walletClient).then((e) =>
                      fetch(
                        `/api/mint?address=${
                          walletClient.account.address
                        }&score=${calculateWalletScore()}`
                      )
                    );
                }}
              >
                Prepare Mint
              </button>
              <p className="mt-2 px-3 py-2 bg-slate-300 rounded-lg">
                {mintsLeft}
              </p>
            </div>
          )}
          <div className="ml-auto my-2 mr-2 p-2">
            <label
              htmlFor="chainID"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Chain
            </label>
            <select
              id="chainID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              value={chainIdInput}
              onChange={handleChainChange}
            >
              <option selected>Choose a Chain ID</option>
              <option value="1">Ethereum</option>
              <option value="137">Polygon</option>
              <option value="56">BSC</option>
              <option value="43114">Avalanche</option>
              <option value="42161">Arbitrum One</option>
              <option value="10">Optimism</option>
              <option value="8453">Base</option>
              <option value="324">zkSync</option>
            </select>
            <Input
              type="search"
              placeholder="Search..."
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                handleButtonClick();
              }}
              onPaste={(e) => {
                setAddressInput(e.clipboardData.getData("text"));
                handleButtonClick();
              }}
              className="my-2 md:w-[100px] lg:w-[300px]"
            />
            <button
              className="bg-green-500 text-white rounded-lg px-4 py-2"
              onClick={handleButtonClick}
            >
              Submit
            </button>
          </div>
        </div>
      </header>
      <main className="p-24">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Wallet Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              Wallet Score: {calculateWalletScore()}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4 p-10 bg-slate-100">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription className="w-96 text-ellipsis overflow-hidden">
                {addressInput}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {apiResponseData?.map((e, i) => (
                  <div key={i} className="flex items-center">
                    <p className="w-96 text-ellipsis overflow-hidden">
                      {e.transaction_hash}
                    </p>
                    <div className="ml-auto font-medium">
                      {(+e.value / 1000000000000000000).toString().slice(0, 6)}{" "}
                      <span>Matic</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NFT</CardTitle>
              <CardDescription>NFT Count {NFTCountState}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {apiNFTResponseData &&
                  apiNFTResponseData.map((data, ind) => (
                    <div key={ind} className="flex items-center">
                      <Avatar key={ind} className="h-9 w-9">
                        <AvatarImage
                          src={process_img(
                            data.image_uri || data?.metadata?.image || ""
                          )}
                          alt="Avatar"
                        />
                        <AvatarFallback>Img</AvatarFallback>
                      </Avatar>
                      <div className="ml-auto font-medium">{data.name}</div>
                      <div className="ml-auto font-medium">
                        {data.floor_prices?.[0]?.value}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </RainbowKitProvider>
  );
}
