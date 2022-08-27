import { useAddress } from "@thirdweb-dev/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { GoldTokenABI } from "../contracts";
const web3 = new Web3(Web3.givenProvider);

function Exchange() {
  const [tokens, setTokens] = useState();
  const [transferAdd, setTransferAdd] = useState();
  const [transferAmt, setTransferAmt] = useState();
  const [matic, setMatic] = useState(0);
  const [balance, setBalance] = useState(0);
  const address = useAddress();
  const router = useRouter();

  const purchase = async () => {
    const accounts = await web3.eth.getAccounts();
    const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
                "address" : accounts[0],
                "amount" : matic.toString()
              })
    };

    fetch("/deposit", requestOptions)
      .then(res => {if(res.ok) return res.json})
      .then((result) => {
        if(result){
          checkBalance();
          alert("You have successfully deposited and received GOLD tokens!");
        }else{
          alert("Error withdrawing tokens");          
        }
      },(error) => {
         console.error(error);
      alert("Error transferring tokens");
    });
  };

  const transfer = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

      const token = new web3.eth.Contract(
          GoldTokenABI,
          "0x5F93d06DEb0EB1a688F0Ff7Aa9173353d1A8f85A"
        );

      const request = await token.methods.transfer(transferAdd.toString(), transferAmt.toString()).send({
        from: accounts[0],
      });

      checkBalance();
      alert("You have successfully transferred!");
    } catch (err) {
      console.error(err);
      alert("Error transferring tokens");
    }
  };

  const sell = async () => {
    const accounts = await web3.eth.getAccounts();
    const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
                "address" : accounts[0],
                "amount" : matic.toString()
              })
    };

    fetch("/withdraw", requestOptions)
      .then(res => { console.log(res); if(res.ok) return res.json})
      .then((result) => {
        console.log(result)
        if(result){
          checkBalance();
          alert("You have successfully withdrew!");
        }else{
          alert("Error withdrawing tokens");          
        }
      },(error) => {
        console.error(error);
        alert("Error withdrawing tokens");
    })
    
  };

  const checkBalance = async () => {
    const accounts = await web3.eth.getAccounts();
    
    const token = new web3.eth.Contract(
      GoldTokenABI,
      "0x5F93d06DEb0EB1a688F0Ff7Aa9173353d1A8f85A"
    );

    const request = await token.methods.balanceOf(accounts[0]).call();

    setBalance(request)
  };

  useEffect(() => {
    if (!address) router.replace("/");
    checkBalance();
  }, [address]);

  useEffect(() => {
    setMatic(tokens * 100);
  }, [tokens]);

  return (
    <div>
      <Head>
        <title>Exchange GOLD tokens</title>
      </Head>
      <div className="exchange__container">
        <h1>Purchase GOLD Tokens</h1>
        <h2>Balance</h2>
        <b>{balance} GOLD (${balance/100})</b>
        <input
          type="number"
          placeholder="Amount ($)"
          className="exchange__textBox"
          value={tokens}
          onChange={(e) => setTokens(e.target.value)}
        />
        <div>MATIC equivalent: {matic}</div>
        <button className="exchange__button" onClick={purchase}>
          Deposit
        </button>
        <button className="exchange__button" onClick={sell}>
          Withdraw
        </button>

        <h1>Transfer</h1>
        <input
          type="text"
          placeholder="Transfer Address"
          className="exchange__textBox"
          value={transferAdd}
          onChange={(e) => setTransferAdd(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount of Token"
          className="exchange__textBox"
          value={transferAmt}
          onChange={(e) => setTransferAmt(e.target.value)}
        />
        <button className="exchange__button" onClick={transfer}>
          Transfer
        </button>
      </div>
    </div>
  );
}

export default Exchange;
