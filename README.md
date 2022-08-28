# ellipsis-2022-hackathon

## What do you need

- [Remix - Ethereum IDE](https://remix.ethereum.org/)
- [Python 3.8.10](https://www.python.org/downloads/release/python-3810/)
- [Node v14.15.4 (LTS)](https://nodejs.org/es/blog/release/v14.15.4/)
- [Metamask extension](https://metamask.io/)
- [Infura - Ethereum API](https://infura.io/)

## Setting up

1. Upload all the `.sol` files in `blockchain` folder onto [Remix](https://remix.ethereum.org/)
2. Compile `gold_token.sol` and `loan_contract.sol`
3. Deploy on a ethereum testnet using Web3 <br>
![image](https://user-images.githubusercontent.com/56392203/187062709-95cafb23-22cd-4eb3-9528-68b154c7ef41.png)
4. Take note of the `Account` used for deployment and `Address` the smart contracts are deployed at.
5. You can check if your token is successfully deployed by going to [Etherscan](https://kovan.etherscan.io/address/0x2fC66763671f23281Fd152B4fb8da6D5AFF0228D)
<br>We are using the kovan testnet.
6. Create and update the `.env` file under `api` folder with your values <br>
<pre>
    GOLDCOIN_ADDRESS=YOUR_TOKEN_ADDRESS
    INFURA_API_KEY=INFURA_API
    DEPLOYER_KEY=STEP_3_ACCOUNT_PRIVATE_KEY  
    DEPLOYED_ADDRESS=STEP_3_ACCOUNT_ADDRESS
</pre>
7. Create and update the `.env.local` file under `web` folder with your values <br>
<pre>
    NEXT_PUBLIC_GOLD_TOKEN_ADDRESS=YOUR_TOKEN_ADDRESS
    NEXT_PUBLIC_LOAN_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
</pre>
8. Start api development server
<pre>
$ cd api
$ python app.py
</pre>
9. Start web development server
<pre>
$ cd web
$ npm run dev
</pre>
