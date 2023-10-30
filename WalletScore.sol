// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

contract WalletScore is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    // Max score for that address
    mapping(address => uint) private _score;
    mapping(address => uint) public mints_left;

    constructor(
        address initialOwner
    ) ERC721("WalletScore", "WLS") Ownable(initialOwner) {}

    function score(address addr) external view returns (uint) {
        return _score[addr];
    }

    function prepare_mint() external payable {
        require(msg.value == 100000000000, "need to pay 0.0000001 matic");
        mints_left[msg.sender] += 1;
    }

    function safeMint(
        address to,
        uint wallet_score,
        string memory tokenUri
    ) public onlyOwner {
        require(mints_left[to] > 0, "no mints left");
        mints_left[to] -= 1;
        uint256 tokenId = _nextTokenId++;
        _score[to] = wallet_score;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal pure {
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );
    }

    function payout(uint256 amt) public onlyOwner {
        (bool sent, ) = address(msg.sender).call{value: amt}("");
        require(sent, "Transaction failer");
    }
}
