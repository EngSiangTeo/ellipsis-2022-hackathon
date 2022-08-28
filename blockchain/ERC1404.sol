// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC1404 is ERC20 {
    address[] private whitelist;    
    address private deployer;

    constructor(string memory name_, string memory symbol_, address deployer_) ERC20(name_, symbol_){
        deployer = deployer_;
    }

    function authorised(address sender) public view returns(bool) {
        if(sender == deployer){
            return true;
        }
        return false;
    }

    function detectTransferRestriction(address from, address to, uint256 value) public view returns (uint8) {
        if(from == address(0)){
            return 0;
        }
        if(to == address(0)){
            return 0;
        }
        if(value <= 0){
            return 0;
        }

        if(whitelisted(to) == true){
            return 1;
        }
        return 0;
    }

    
    function whitelisted(address userAddress) public view returns (bool) {        
        for(uint i = 0; i < whitelist.length; i++){
            if(whitelist[i] == userAddress){
                return true;
            }
        }
        return false;
    }

    function whitelistUser(address userAddress) public returns(bool){
        require(authorised(msg.sender), "Unauthorised");
        whitelist.push(userAddress);
        return true;
    }

}