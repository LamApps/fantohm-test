pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Vault is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct UserInfo {
        address wallet;
        uint256 stakingAmount;
        address token;
    }

    struct Funder {
        address wallet;
        uint256 amount;
    }

    UserInfo[] public userInfos;
    Funder[] public topFunders;
    mapping(address => uint256) public ids;

    event Deposit(
        address indexed staker,
        address indexed token,
        uint256 amount
    );

    event Withdraw(
        address indexed staker,
        address indexed token,
        uint256 amount
    );

    constructor() {
        for (uint256 i = 0;  i < 3; i++) {
            topFunders.push(Funder({
                wallet: address(0x0),
                amount: 0
            }));
        }
    }

    function quickSort(Funder[] memory arr, int left, int right) internal {
        int i = left;
        int j = right;
        if (i == j) return;
        Funder memory pivot = arr[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint(i)].amount > pivot.amount) i++;
            while (pivot.amount > arr[uint(j)].amount) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

    function deposit(address token, uint256 amount) external nonReentrant {
        require(token != address(0x0), "Token Address is zero address");
        require(amount > 0, "Staking Amount should be greater than 0");

        if (ids[msg.sender] > 0) {
            userInfos[ids[msg.sender].sub(1)].stakingAmount = userInfos[ids[msg.sender].sub(1)].stakingAmount.add(amount);
        } else {
            userInfos.push(UserInfo({
                wallet: msg.sender,
                token: token,
                stakingAmount: amount
            }));
            ids[msg.sender] = userInfos.length;
        }
        if (topFunders[2].amount <= userInfos[ids[msg.sender].sub(1)].stakingAmount) {
            if (topFunders[1].amount <= userInfos[ids[msg.sender].sub(1)].stakingAmount) {
                if (topFunders[0].amount <= userInfos[ids[msg.sender].sub(1)].stakingAmount) {
                    topFunders[0].amount = userInfos[ids[msg.sender].sub(1)].stakingAmount;
                    topFunders[0].wallet = msg.sender;
                } else {
                    topFunders[1].amount = userInfos[ids[msg.sender].sub(1)].stakingAmount;
                    topFunders[1].wallet = msg.sender;
                }
            } else {
                topFunders[2].amount = userInfos[ids[msg.sender].sub(1)].stakingAmount;
                topFunders[2].wallet = msg.sender;
            }
        }
        emit Deposit(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) external nonReentrant {
        require(ids[msg.sender] > 0, "You have not staked before.");
        require(userInfos[ids[msg.sender].sub(1)].token == token, "Request token is different with you staked.");
        require(userInfos[ids[msg.sender].sub(1)].stakingAmount >= amount, "You are trying to withdraw more than you staked.");
        userInfos[ids[msg.sender].sub(1)].stakingAmount =  userInfos[ids[msg.sender].sub(1)].stakingAmount.sub(amount);

        if (msg.sender == topFunders[0].wallet) {
            topFunders[0].amount = userInfos[ids[msg.sender].sub(1)].stakingAmount;
        }
        if (msg.sender == topFunders[1].wallet) {
            topFunders[1].amount = userInfos[ids[msg.sender].sub(1)].stakingAmount;
        }
        if (msg.sender == topFunders[2].wallet) {
            topFunders[2].amount = userInfos[ids[msg.sender].sub(1)].stakingAmount;
        }
        quickSort(topFunders, 0, 2);

        emit Withdraw(msg.sender, token, amount);
    }


    function getMostFunders() public view returns (address, address) {
        return (topFunders[0].wallet, topFunders[1].wallet);
    }

}