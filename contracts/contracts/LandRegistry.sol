// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {
    struct Land {
        address admin;
        address owner;
        string ownerName;
        string ownerEmail;
        uint256 area;
        string locationHash;
        uint256 valuation;
        uint256 registeredAt;
        bool isPaid;
    }

    mapping(string => Land) public lands;

    event LandRegistered(
        string indexed landId,
        address indexed owner,
        address indexed admin,
        string ownerName,
        string ownerEmail,
        uint256 area,
        string locationHash,
        uint256 valuation,
        uint256 registeredAt
    );

    event PaymentConfirmed(string indexed landId, address indexed owner, uint256 amount);
    event OwnershipTransferred(string indexed landId, address indexed oldOwner, address indexed newOwner);

    modifier onlyAdmin(string memory landId) {
        require(msg.sender == lands[landId].admin, "Only admin can perform this action");
        _;
    }

    modifier onlyOwner(string memory landId) {
        require(msg.sender == lands[landId].owner, "Only owner can perform this action");
        _;
    }

    function registerLand(
        string memory landId,
        address owner,
        string memory ownerName,
        string memory ownerEmail,
        uint256 area,
        string memory locationHash,
        uint256 valuation
    ) public {
        require(lands[landId].owner == address(0), "Land already registered!");

        lands[landId] = Land({
            admin: msg.sender,
            owner: owner,
            ownerName: ownerName,
            ownerEmail: ownerEmail,
            area: area,
            locationHash: locationHash,
            valuation: valuation,
            registeredAt: block.timestamp,
            isPaid: false
        });

        emit LandRegistered(
            landId,
            owner,
            msg.sender,
            ownerName,
            ownerEmail,
            area,
            locationHash,
            valuation,
            block.timestamp
        );
    }

    function payForLand(string memory landId) public payable onlyOwner(landId) {
        require(!lands[landId].isPaid, "Already paid for this land");
        require(msg.value >= lands[landId].valuation, "Insufficient payment!");

        lands[landId].isPaid = true;
        payable(lands[landId].admin).transfer(msg.value);

        emit PaymentConfirmed(landId, msg.sender, msg.value);
    }

    function transferOwnership(string memory landId, address newOwner) public onlyOwner(landId) {
        require(newOwner != address(0), "New owner address is zero");
        address oldOwner = lands[landId].owner;
        lands[landId].owner = newOwner;

        emit OwnershipTransferred(landId, oldOwner, newOwner);
    }

    function getLand(string memory landId) public view returns (Land memory) {
        require(lands[landId].owner != address(0), "Land not registered");
        return lands[landId];
    }
}