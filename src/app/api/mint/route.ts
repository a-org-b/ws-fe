import { mint } from "@/services/smartcontract/prepare_mint";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { create_image } from "./image";
import { storeNFT } from "./nft-storage";

//TODO
const account = privateKeyToAccount(process.env.PV_KEY as `0x${string}` ?? "0xabcd")
const client = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http()
})
export async function GET(
    req: Request
) {
    const { searchParams } = new URL(req.url)
    const score = 100;
    create_image(score);
    const res = await storeNFT("./image.png", "Wallet Score NFT", "Showcase your on chain score to frens");
    console.log(res);
    const address = searchParams.get('address') as `0x${string}`
    if (address != null) {
        console.log("minting");
        await mint(client, address, BigInt(10000), res.url);
        return Response.json('mint successful', { status: 200 })
    }
    else {
        return Response.json({ error: 'address is required' }, { status: 400 })
    }
}