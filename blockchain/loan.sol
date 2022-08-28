// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Loan {
    address public lender;
    address public borrower;
    ERC20 public token;
    uint256 public collateralAmount;
    uint256 public payoffAmount;
    uint256 public dueDate;

    constructor(
        address _lender,
        address _borrower,
        ERC20 _token,
        uint256 _collateralAmount,
        uint256 _payoffAmount,
        uint256 loanDuration
    )
    {
        lender = _lender;
        borrower = _borrower;
        token = _token;
        collateralAmount = _collateralAmount;
        payoffAmount = _payoffAmount;
        dueDate = block.timestamp + (loanDuration * 1 minutes);
    }

    event LoanPaid();

    function payLoan() public payable {
        require(msg.sender == borrower, "Unauthorised");
        require(block.timestamp <= dueDate, "Due Date over.");
        require(msg.value == payoffAmount, "Wrong pay off amount");
        require(token.transfer(borrower, collateralAmount), "Error Here");
        emit LoanPaid();
        selfdestruct(payable(lender));
    }

    function repossess() public {
        require(msg.sender == lender, "Unauthorised");
        require(block.timestamp > dueDate, "Due Date not up.");

        require(token.transfer(lender, collateralAmount), "X");        
        selfdestruct(payable(lender));
    }
}