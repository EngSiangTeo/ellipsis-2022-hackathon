import React, { useEffect, useState } from "react";

function NavBar(props) {


  return (
    <div className="topnav">
      <a className={`${props.name == "exchange" ? "active" : ""}`} href="/exchange">Exchange</a>
      <a className={`${props.name == "loan" ? "active" : ""}`} href="/loan">Loan</a>
      <div class="topnav-right">
        <a>Hi, {props.username}</a>
      </div>
    </div>
  );
}

export default NavBar;
