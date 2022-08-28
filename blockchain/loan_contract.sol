// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./loan_request.sol";
import "./gold_token.sol";

contract LoanContract {
    constructor(){}

    event newLoanRequest(address loanRequest);

    function newLoan(
        uint256 _collateralAmount,
        uint256 _loanAmount,
        uint256 _payoffAmount,
        uint256 _loanDuration) public payable {
        LoanRequest loanRequest = new LoanRequest(GoldToken(address(0x1DfCC7D0e563591A0546c2DfEe92161C53Cd1162)), _collateralAmount, _loanAmount, _payoffAmount, _loanDuration, msg.sender);
        emit newLoanRequest(address(loanRequest));
    }
}