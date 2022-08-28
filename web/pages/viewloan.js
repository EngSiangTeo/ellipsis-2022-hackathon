import { useAddress } from "@thirdweb-dev/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { GoldTokenABI, LoanRequestABI, LoanABI } from "../contracts";
import moment from 'moment';
import NavBar from "./navbar"

const web3 = new Web3(Web3.givenProvider);

function ViewLoan() {

  const [collateralAmount, setCollateralAmount] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [payoffAmount, setPayoffAmount] = useState();
  const [username, setUsername] = useState();
  const [loanDuration, setLoanDuration] = useState();
  const [borrower, setBorrower] = useState();
  const [loanAddress, setLoanAddress] = useState();
  const [account, setAccount] = useState();
  const [approved, setApproved] = useState();
  const [dueDate, setDueDate] = useState();
  
  const [balance, setBalance] = useState(0);
  const address = useAddress();
  const router = useRouter();

  const approveLoan = async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      const token = new web3.eth.Contract(
        GoldTokenABI,
        "0x1DfCC7D0e563591A0546c2DfEe92161C53Cd1162"
      );

      const request = await token.methods.approve(router.query.add, collateralAmount).send({
        from: accounts[0],
      });

      alert("You have successfully approved the request!");

      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        }
      }

      fetch("api/loan/"+ router.query.add, requestOptions)
        .then((result) => {
          result.text().then(text => {
            if(text != "not ok"){
              router.reload(window.location.pathname)
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

  const lendEther = async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      const loanContract = new web3.eth.Contract(
          LoanRequestABI,
          router.query.add
        );

      const request = await loanContract.methods.lendEther().send({
        from: accounts[0],
        value: Web3.utils.toWei(loanAmount, 'ether')
      });

      alert("You have successfully created a request!");      
      router.replace("/loan");

    } catch (err) {
      console.error(err);
      alert("Error transferring tokens");
    }
  };

  const claimCollateral = async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      const loanDetails = new web3.eth.Contract(
          LoanABI,
          loanAddress
        );

      const request = await loanDetails.methods.repossess().send({
        from: accounts[0]
      });

      alert("You have successfully claimed!");

    } catch (err) {
      console.error(err);
      alert("Error transferring tokens");
    }
  };  

  const repayLoan = async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      const loanDetails = new web3.eth.Contract(
          LoanABI,
          loanAddress
        );

      const request = await loanDetails.methods.payLoan().send({
        from: accounts[0],
        value: Web3.utils.toWei(payoffAmount, 'ether')
      });

      alert("You have successfully repaid!");
      router.replace("/loan");

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

  const getContractInfo = async () => {

    if(!router.query.add) return

    fetch("api/loan/"+ router.query.add)
    .then(res => res.json())
    .then((result) => {
      setBorrower(result.user)
      setApproved(result.approved)
      console.log(result)
    })

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0])

    const loanRequest = new web3.eth.Contract(
        LoanRequestABI,
        router.query?.add
      )
    
    var collateralAmt = await loanRequest.methods.collateralAmount().call();
    setCollateralAmount(collateralAmt)
    var loanAmt = await loanRequest.methods.loanAmount().call();
    setLoanAmount(Web3.utils.fromWei(loanAmt, 'ether'));
    var payoffAmt = await loanRequest.methods.payoffAmount().call();
    setPayoffAmount(Web3.utils.fromWei(payoffAmt, 'ether'))
    var loanD = await loanRequest.methods.loanDuration().call();
    setLoanDuration(loanD);
    
    var loanAdd = await loanRequest.methods.loan().call();
    setLoanAddress(loanAdd);
    console.log(loanAddress);
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
    getContractInfo();

  }, [router.query, address]);


  const getLoanDetails = async () => {
    if(loanAddress == "0x0000000000000000000000000000000000000000" || !web3.utils.isAddress(loanAddress)) return

    console.log(loanAddress)

    const loanDetails = new web3.eth.Contract(
      LoanABI,
      loanAddress
    );
    
    var due = await loanDetails.methods.dueDate().call();
    const dateTimeString = 
    console.log(moment().unix())
    setDueDate(due);
  }

  useEffect(() => {
    getLoanDetails();
  }, [loanAddress])


  return (
    <div>
      <Head>
        <title>Collateral Loan</title>
      </Head>
      <NavBar name="loan" username={username}/>
      <div className="exchange__container">
        <h1>Loan ({router.query?.add})</h1>
        <h2>Balance</h2>
        <b>{balance} GOLD (${balance/100})</b>
        <p></p>
        <p><b>Borrower :</b> {borrower}</p>
        <table>
        <tbody>
        <tr>
          <th>Collateral Amount</th>
          <td>{collateralAmount} GOLD</td>
        </tr>
        <tr>
          <th>Loan Amount</th>
          <td>{loanAmount} ETH</td>
        </tr>
        <tr>
          <th>Payoff Amount</th>
          <td>{payoffAmount} ETH</td>
        </tr>
        <tr>
          <th>Loan Duration</th>
          <td>{loanDuration} minutes</td>
        </tr>
        <tr>
          <th>Approved</th>
          <td>{approved}</td>
        </tr>
        </tbody>
        </table>
        {approved=="false" && borrower == account ? <button className="exchange__button" onClick={approveLoan}>Approve</button> : <p></p> }
        {loanAddress=="0x0000000000000000000000000000000000000000" ? borrower != account && approved == "true" ? <button className="exchange__button" onClick={lendEther}>Lend Ether</button> : <p></p> : <p>Loaned @ <a href={"#"+loanAddress}>{loanAddress}</a></p>}
        {loanAddress!="0x0000000000000000000000000000000000000000" && <p>Due Date : {moment.unix(dueDate).format("DD-MM-YYYY HH:mm:ss")}</p>}
        {dueDate < moment().unix() && <button className="exchange__button" onClick={claimCollateral}>Claim Collateral</button>}
        {dueDate > moment().unix() && <button className="exchange__button" onClick={repayLoan}>Repay</button>}
      </div>
    </div>
  );
}

export default ViewLoan;
