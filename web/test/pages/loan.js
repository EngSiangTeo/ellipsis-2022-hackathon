import { useAddress } from "@thirdweb-dev/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { LoanContractABI, GoldTokenABI, LoanRequestABI } from "../contracts";
import NavBar from "./navbar"

const web3 = new Web3(Web3.givenProvider);

function Loan() {
  const [collateralAmount, setCollateralAmount] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [username, setUsername] = useState();
  const [payoffAmount, setPayoffAmount] = useState();
  const [loanDuration, setLoanDuration] = useState();
  const [loanRequests, setLoanRequests] = useState([]);
  const [balance, setBalance] = useState(0);
  const address = useAddress();
  const router = useRouter();

  const createNewLoan = async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      const loanContract = new web3.eth.Contract(
          LoanContractABI,
          "0xa1f5A53AD7559B189C22752E557aD96A3cF52630"
        );

      const request = await loanContract.methods.newLoan(collateralAmount, loanAmount*100, payoffAmount*100, loanDuration).send({
        from: accounts[0],
      });

      console.log(request.events.newLoanRequest.returnValues.loanRequest)

      alert("You have successfully created a request!");

      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          "address" : request.events.newLoanRequest.returnValues.loanRequest,
          "wallet" : accounts[0],
          "approved" : "false"
        })
      }

      fetch("/loans", requestOptions)
        .then((result) => {
          result.text().then(text => {
            if(text != "not ok"){
              getLoans()
            }else{
              alert("Error. Please reload")
            }
          })
        },(error) => {
           console.error(error);
      });

    } catch (err) {
      console.error(err);
      alert("Error transferring tokens");
    }
  };

  const checkBalance = async () => {
    const accounts = await web3.eth.getAccounts();
    
    const token = new web3.eth.Contract(
      GoldTokenABI,
      "0x1DfCC7D0e563591A0546c2DfEe92161C53Cd1162"
    );

    const request = await token.methods.balanceOf(accounts[0]).call();

    setBalance(request)
  };

  const getLoans = async () => {
    fetch("/api/loan")
    .then(res => res.json())
    .then((result) => {
      setLoanRequests(result)
    })
  }

  useEffect(() => {
    if (address){
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          "wallet" : address
        })
    };

    fetch("/login", requestOptions)
      .then((result) => {
        result.text().then(text => {
          if(text != "not ok"){
            setUsername(text)
          }else{
            router.replace("/new");
          }
        })
      },(error) => {
         console.error(error);
    });
    }
  }, [address]);

  useEffect(() => {
    checkBalance();
    getLoans();

  }, [address]);

  return (
    <div>
      <Head>
        <title>Collateral Loan</title>
      </Head>
      <NavBar name="loan" username={username}/>
      <div className="exchange__container">
        <h1>Collateral Loan</h1>
        <h2>Balance</h2>
        <b>{balance} GOLD (${balance/100})</b>
        <h2>New Loan Request</h2>
        <input
          type="number"
          placeholder="Collateral Amount (GOLD)"
          className="exchange__textBox"
          value={collateralAmount}
          onChange={(e) => setCollateralAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Loan Amount (ETH)"
          className="exchange__textBox"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Payoff Amount (ETH)"
          className="exchange__textBox"
          value={payoffAmount}
          onChange={(e) => setPayoffAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Loan Duration (min)"
          className="exchange__textBox"
          value={loanDuration}
          onChange={(e) => setLoanDuration(e.target.value)}
        />
        <button className="exchange__button" onClick={createNewLoan}>
          Request Loan
        </button>

        <h2>Requests</h2>
        <table border="1">
        <thead>
        <tr>
          <th>Loan</th>
          <th>Borrower</th>
          <th>Approved</th>
        </tr>
        </thead>
        <tbody>
        {
          Object.entries(loanRequests).map( (x,i) => {
            return (
              <tr key={x[0]}>
              <td><a href={"/viewloan?add="+x[0]}>{x[0]}</a></td>
              <td>{x[1].user}</td>
              <td>{x[1].approved}</td>
              </tr>
            )
          })
        }
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default Loan;
