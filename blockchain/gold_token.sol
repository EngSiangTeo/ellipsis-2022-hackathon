// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "ERC1404.sol";

contract GoldToken is ERC1404 {
    constructor() ERC1404("GoldToken", "GOLD", msg.sender){
        _mint(msg.sender, 500 * 10 ** decimals());
        whitelistUser(msg.sender);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    function deposit(address userAddress, uint256 addedValue) public returns (bool) {
        require(authorised(msg.sender), "Unauthorised");
        require(detectTransferRestriction(msg.sender, userAddress, addedValue) == 1, "Restricted");
        _mint(userAddress, addedValue);
        return true;
    }

    function withdraw(address userAddress, uint256 addedValue) public returns (bool) {
        require(authorised(msg.sender), "Unauthorised");
        require(detectTransferRestriction(msg.sender, userAddress, addedValue) == 1, "Restricted");
        _burn(userAddress, addedValue);
        return true;
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        require(detectTransferRestriction(msg.sender, to, amount) == 1, "Restricted");
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }
}