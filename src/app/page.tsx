"use client";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface Transaction {
  blockNumber: number;
  blockTimestamp: string;
  value: string;
  contractAddress: string;
}

export default function Home(): JSX.Element {
  const pbClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [chainIdInput, setChainIdInput] = useState<string>("");
  const [addressInput, setAddressInput] = useState<string>("");
  const [apiResponseData, setApiResponseData] = useState<Transaction[] | null>(
    null
  );
  const [transactionCount, setTransactionCount] = useState<number>(0);
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

  const makeAPICall = (): void => {
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
          console.log(response.data.data[0].transaction_hash);
          let count = response.data.count;
          let valueSum = 0;
          response.data.data.forEach((item: Transaction) => {
            valueSum += parseInt(item.value);
          });
          setTransactionCount(count);
          setTotalTransactionValue(valueSum);
        } else {
          console.error("Invalid response format.");
        }
      })
      .catch((error: any) => console.error(error));
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
              onClick={makeAPICall}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Make API Call
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pl-36 bg-slate-100">
          <Table className="mt-8">
            <TableCaption>A list of your transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-92">Address</TableHead>
                <TableHead>Transaction Count</TableHead>
                <TableHead>Total Transaction Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium truncate">
                  {addressInput}
                </TableCell>
                <TableCell>{transactionCount}</TableCell>
                <TableCell>{totalTransactionValue}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table className="mt-8">
            <TableCaption>A list of your transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-92">Address</TableHead>
                <TableHead>Transaction Count</TableHead>
                <TableHead>Total Transaction Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{transactionCount}</TableCell>
                <TableCell>{totalTransactionValue}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table className="mt-8">
            <TableCaption>A list of your transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-92">Address</TableHead>
                <TableHead>Transaction Count</TableHead>
                <TableHead>Total Transaction Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{addressInput}</TableCell>
                <TableCell>{transactionCount}</TableCell>
                <TableCell>{totalTransactionValue}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table className="mt-8">
            <TableCaption>A list of your transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-92">Address</TableHead>
                <TableHead>Transaction Count</TableHead>
                <TableHead>Total Transaction Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{addressInput}</TableCell>
                <TableCell>{transactionCount}</TableCell>
                <TableCell>{totalTransactionValue}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </main>
    </RainbowKitProvider>
  );
}
