// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract GoldToken is ERC20 {
    address private deployer;

    constructor() ERC20("GoldToken", "GOLD"){
        _mint(msg.sender, 500 * 10 ** decimals());
        deployer = msg.sender;
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    function deposit(address userAddress, uint256 addedValue) public returns (bool) {
        require(msg.sender == deployer, "Unauthorised");
        _mint(userAddress, addedValue);
        return true;
    }

    function withdraw(address userAddress, uint256 addedValue) public returns (bool) {
        require(msg.sender == deployer, "Unauthorised");
        _burn(userAddress, addedValue);
        return true;
    }
}