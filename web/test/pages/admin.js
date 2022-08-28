import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Admin() {
  const [userWallet, setUserWallet] = useState();
  const [username, setUsername] = useState();
  const router = useRouter();

  const onboard = async () => {
    const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
                "wallet" : userWallet,
                "username" :username
              })
    };

    fetch("/onboard", requestOptions)
      .then(res => {if(res.ok) return res.json})
      .then((result) => {
        if(result){
          alert("User onboarded and whitelisted!");
        }else{
          alert("Error onboarding");          
        }
      },(error) => {
         console.error(error);
      alert("Error onboarding");
    });
  };

  
  return (
    <div>
      <Head>
        <title>Admin Portal</title>
      </Head>
      <div className="exchange__container">
        <h1>Onboard new user</h1>
        <input
          type="text"
          placeholder="Wallet Address"
          className="exchange__textBox"
          value={userWallet}
          onChange={(e) => setUserWallet(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          className="exchange__textBox"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="exchange__button" onClick={onboard}>
          Onboard
        </button>
      </div>
    </div>
  );
}

export default Admin;
