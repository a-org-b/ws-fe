## Wallet Score App

# Problem
We noticed some application forms requires wallet address, mostly to check on chain activities (VC, accelerators application for founders). This wallet address is then checked for token holdings and dapps interactions to check if the expirence is wallet.

Instead of doing this manually we thought why not calculate the score and issue the sould bound NFT with that score.

# Introducing Wallet Score
Wallet Score introduces ability to analysis wallet's on chain activity, see score for on chain interactions and mint nft with that score.

There are three main components useful in this application,
- Wallet Score - To check on chain score calculated by factors like smartcontract deployments, high value transactions, high value token holdings, high value NFT holdings and more like this.

- Dashboard - Here the top parameters to calculate score are showed in detailed, like transactios with value and to address. Top NFTs holdings with there value and smart contract address. Tokens holding with real value in dollar. Smart contract deployments.

- WS NFT - User can mint Soul Bound NFT which will have score attached and he can showcase or present that NFT anywhere.

# Tools used to build this

- Viem - Ether JS replacement used to interact with smart contracts.

- NextJS + TypeScript - Both Frontend and Backend made in it.

- Solidity - To develop Soul Bond NFT with mint balance.

- ChainBase - Most important which powers the app with its API to provide data neccessary to calculate wallet score and show top intaractions, along with ability to create own APIs using SQL queries [ChainBase Data cloud](https://console.chainbase.com/dataCloud)

# Running app locally

- Make sure you have yarn and node 18+ installed.
- Then run `yarn` to install all dependencies.
- Then setup .env.local file, refer sample.env for info about how to obtain this.
- Then run `yarn dev` to start development server.
