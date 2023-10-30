"use client";

import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  blockNumber: number;
  blockTimestamp: string;
  value: string;
  contractAddress: string;
}

export default function Home(): JSX.Element {
  const [chainIdInput, setChainIdInput] = useState<string>("");
  const [addressInput, setAddressInput] = useState<string>("");
  const [apiResponseData, setApiResponseData] = useState<Transaction[] | null>(
    null
  );
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [totalTransactionValue, setTotalTransactionValue] = useState<number>(0);

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
      {apiResponseData && (
        <Table className="mt-8">
          <TableCaption>A list of your transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Address</TableHead>
              <TableHead>Transaction Count</TableHead>
              <TableHead>Total Transaction Value</TableHead>
              <TableHead className="text-right">Wallet Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{addressInput}</TableCell>
              <TableCell>{transactionCount}</TableCell>
              <TableCell>{totalTransactionValue}</TableCell>
              <TableCell className="text-right">
                {transactionCount + totalTransactionValue}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </main>
  );
}
