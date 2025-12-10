// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GenerativeArtNFT
 * @dev NFT contract for minting and selling generative art
 */
contract GenerativeArtNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to price
    mapping(uint256 => uint256) public tokenPrices;
    
    // Mapping from token ID to listing status
    mapping(uint256 => bool) public listedForSale;
    
    // Events
    event ArtMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event ArtListed(uint256 indexed tokenId, uint256 price);
    event ArtUnlisted(uint256 indexed tokenId);
    event ArtSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    
    constructor() ERC721("GenerativeArtNFT", "GANFT") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new NFT with the given token URI
     * @param tokenURI The URI containing the metadata for the NFT
     * @return The token ID of the newly minted NFT
     */
    function mintArt(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit ArtMinted(newTokenId, msg.sender, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev List an NFT for sale
     * @param tokenId The ID of the token to list
     * @param price The price in wei
     */
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT");
        require(price > 0, "Price must be greater than 0");
        
        tokenPrices[tokenId] = price;
        listedForSale[tokenId] = true;
        
        emit ArtListed(tokenId, price);
    }
    
    /**
     * @dev Unlist an NFT from sale
     * @param tokenId The ID of the token to unlist
     */
    function unlistFromSale(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can unlist the NFT");
        require(listedForSale[tokenId], "NFT is not listed for sale");
        
        listedForSale[tokenId] = false;
        tokenPrices[tokenId] = 0;
        
        emit ArtUnlisted(tokenId);
    }
    
    /**
     * @dev Purchase a listed NFT
     * @param tokenId The ID of the token to purchase
     */
    function buyArt(uint256 tokenId) public payable {
        require(listedForSale[tokenId], "NFT is not listed for sale");
        require(msg.value >= tokenPrices[tokenId], "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        uint256 price = tokenPrices[tokenId];
        
        // Unlist the NFT
        listedForSale[tokenId] = false;
        tokenPrices[tokenId] = 0;
        
        // Transfer the NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Transfer payment to seller
        (bool success, ) = payable(seller).call{value: price}("");
        require(success, "Payment transfer failed");
        
        // Refund excess payment
        if (msg.value > price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit ArtSold(tokenId, seller, msg.sender, price);
    }
    
    /**
     * @dev Get the total number of minted NFTs
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Get all NFTs owned by an address
     * @param owner The address to query
     * @return An array of token IDs
     */
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (_ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }
        
        return tokens;
    }
}
