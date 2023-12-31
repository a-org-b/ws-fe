import WS from "@/app/contracts/WS";
import { WSADDR } from "@/config";
import { getContract } from "viem";
import { PublicClient, WalletClient } from "wagmi";

export const prepare_mint = async (walletClient: WalletClient) => {
    if (!walletClient.account) {
        //TODO: error
        return;
    }
    try {
        const wsNFT = getContract({
            address: WSADDR,
            abi: WS,
            walletClient,
        });
        await wsNFT.write.
            prepare_mint({ account: walletClient.account, chain: walletClient.chain, value: BigInt(100000000000) });
    } catch (err: unknown) {
        console.log(err);
    }
};

export const mint = async (walletClient: WalletClient, to: `0x${string}`, score: bigint, uri: string) => {
    if (!walletClient.account) {
        //TODO: error
        return;
    }
    try {
        const wsNFT = getContract({
            address: WSADDR,
            abi: WS,
            walletClient,
        });
        await wsNFT.write.
            safeMint([to, score, uri], { account: walletClient.account, chain: walletClient.chain });
    } catch (err: unknown) {
        console.log(err);
    }
};

export const get_mint = async (publicClient: PublicClient, addr: `0x${string}`) => {
    try {
        const wsNFT = getContract({
            address: WSADDR,
            abi: WS,
            publicClient,
        });
        return await wsNFT.read.
            mints_left([addr]);
    } catch (err: unknown) {
        console.log(err);
    }
};