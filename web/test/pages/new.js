import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function newUser() {
const router = useRouter();
  const retry = async () => {
    router.replace("/");
  }
  
  return (
    <div>
      <Head>
        <title>Onboarding</title>
      </Head>
      <div className="exchange__container">
        <p>You are currently not onboarded yet</p>
        <button className="exchange__button" onClick={retry}>
          Re-try
        </button>
      </div>
    </div>
  );
}

export default newUser;
