// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./B.sol";

contract A is B{

    uint private value;

    // Initializer
    function store(uint _initialValue) public setSuperAdmin{
        value = _initialValue;
    }

    function setter(uint _increment) public onlyAdmin {
        value += _increment;
    }

    function getter() public view returns(uint) {
        return value;
    }
     
}

