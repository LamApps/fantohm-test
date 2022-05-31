pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ABC is ERC20('ABC Token', 'ABC') {

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

}
