// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

contract B {
    address public superAdmin;
    mapping(address => bool) public isAdmin;

    // Called only once by initializer of contract A
    modifier setSuperAdmin() {
        superAdmin = msg.sender;
        isAdmin[msg.sender] = true;
        _;
    }

    function addAdmin(address _newAdmin) public onlySuperAdmin {
        isAdmin[_newAdmin] = true;
    }

    function removeAdmin(address _admin) public onlySuperAdmin {
        isAdmin[_admin] = false;
    }

    function transferAdminRole(address _to) public onlyAdmin{
        isAdmin[_to] = true;
        isAdmin[msg.sender] = false;
    }

    function renounceAdminRole() public onlyAdmin {
        isAdmin[msg.sender] = false;
    }


    modifier onlySuperAdmin {
        require(msg.sender == superAdmin, "Only superAdmin can perform this task.");
        _;
    }
    modifier onlyAdmin {
        require(isAdmin[msg.sender], "You're not admin.");
        _;
    }

}