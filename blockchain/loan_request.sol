// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./loan.sol";

contract LoanRequest {
    address public borrower;
    ERC20 public token;
    uint256 public collateralAmount;
    uint256 public loanAmount;
    uint256 public payoffAmount;
    uint256 public loanDuration;

    constructor (
        ERC20 _token,
        uint256 _collateralAmount,
        uint256 _loanAmount,
        uint256 _payoffAmount,
        uint256 _loanDuration,
        address _borrower
    ) payable {
        token = _token;
        collateralAmount = _collateralAmount;
        loanAmount = _loanAmount * 1e16;
        payoffAmount = _payoffAmount *  1e16 ;
        loanDuration = _loanDuration;
        borrower = _borrower;
    }

    Loan public loan;

    event LoanRequestAccepted(address loan);

    function lendEther() public payable {
        require(msg.value == loanAmount, "Wrong Amount");
        loan = new Loan(
            msg.sender,
            borrower,
            token,
            collateralAmount,
            payoffAmount,
            loanDuration
        );
        require(token.transferFrom(borrower, address(loan), collateralAmount));
        payable(borrower).transfer(loanAmount);
        emit LoanRequestAccepted(address(loan));
    }
}