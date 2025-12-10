# API Documentation

## Smart Contract API

### Contract Address
- **Testnet**: Set via `REACT_APP_CONTRACT_ADDRESS` environment variable
- **Network**: Ethereum compatible chains

### Contract: GenerativeArtNFT

Inherits from OpenZeppelin's ERC721URIStorage and Ownable contracts.

---

## Public Functions

### mintArt
```solidity
function mintArt(string memory tokenURI) public returns (uint256)
```

Mints a new NFT with the provided token URI.

**Parameters:**
- `tokenURI` (string): URI pointing to the NFT metadata/image

**Returns:**
- `uint256`: The token ID of the newly minted NFT

**Events Emitted:**
- `ArtMinted(uint256 indexed tokenId, address indexed owner, string tokenURI)`

**Example:**
```javascript
const tx = await contract.mintArt("https://example.com/metadata.json");
await tx.wait();
```

---

### listForSale
```solidity
function listForSale(uint256 tokenId, uint256 price) public
```

Lists an NFT for sale at the specified price.

**Parameters:**
- `tokenId` (uint256): The ID of the token to list
- `price` (uint256): The price in wei

**Requirements:**
- Caller must be the owner of the token
- Price must be greater than 0

**Events Emitted:**
- `ArtListed(uint256 indexed tokenId, uint256 price)`

**Example:**
```javascript
const price = ethers.parseEther("1.0"); // 1 ETH
const tx = await contract.listForSale(1, price);
await tx.wait();
```

---

### unlistFromSale
```solidity
function unlistFromSale(uint256 tokenId) public
```

Removes an NFT from sale listings.

**Parameters:**
- `tokenId` (uint256): The ID of the token to unlist

**Requirements:**
- Caller must be the owner of the token
- Token must be currently listed

**Events Emitted:**
- `ArtUnlisted(uint256 indexed tokenId)`

**Example:**
```javascript
const tx = await contract.unlistFromSale(1);
await tx.wait();
```

---

### buyArt
```solidity
function buyArt(uint256 tokenId) public payable
```

Purchases a listed NFT.

**Parameters:**
- `tokenId` (uint256): The ID of the token to purchase

**Payable:**
- Must send at least the listing price in ETH

**Requirements:**
- Token must be listed for sale
- Sent value must be >= listing price

**Events Emitted:**
- `ArtSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price)`

**Example:**
```javascript
const price = await contract.tokenPrices(1);
const tx = await contract.buyArt(1, { value: price });
await tx.wait();
```

---

## View Functions

### totalSupply
```solidity
function totalSupply() public view returns (uint256)
```

Returns the total number of minted NFTs.

**Returns:**
- `uint256`: Total supply

**Example:**
```javascript
const total = await contract.totalSupply();
console.log(`Total NFTs: ${total}`);
```

---

### tokensOfOwner
```solidity
function tokensOfOwner(address owner) public view returns (uint256[] memory)
```

Returns all token IDs owned by an address.

**Parameters:**
- `owner` (address): The address to query

**Returns:**
- `uint256[]`: Array of token IDs

**Example:**
```javascript
const tokens = await contract.tokensOfOwner(accountAddress);
console.log(`User owns ${tokens.length} NFTs`);
```

---

### tokenURI
```solidity
function tokenURI(uint256 tokenId) public view returns (string memory)
```

Returns the metadata URI for a token.

**Parameters:**
- `tokenId` (uint256): The token ID

**Returns:**
- `string`: Token URI

**Example:**
```javascript
const uri = await contract.tokenURI(1);
console.log(`Token URI: ${uri}`);
```

---

### ownerOf
```solidity
function ownerOf(uint256 tokenId) public view returns (address)
```

Returns the owner of a token.

**Parameters:**
- `tokenId` (uint256): The token ID

**Returns:**
- `address`: Owner address

**Example:**
```javascript
const owner = await contract.ownerOf(1);
console.log(`Token owner: ${owner}`);
```

---

### listedForSale
```solidity
function listedForSale(uint256 tokenId) public view returns (bool)
```

Checks if a token is listed for sale.

**Parameters:**
- `tokenId` (uint256): The token ID

**Returns:**
- `bool`: True if listed, false otherwise

**Example:**
```javascript
const isListed = await contract.listedForSale(1);
console.log(`Is listed: ${isListed}`);
```

---

### tokenPrices
```solidity
function tokenPrices(uint256 tokenId) public view returns (uint256)
```

Returns the listing price of a token.

**Parameters:**
- `tokenId` (uint256): The token ID

**Returns:**
- `uint256`: Price in wei (0 if not listed)

**Example:**
```javascript
const price = await contract.tokenPrices(1);
console.log(`Price: ${ethers.formatEther(price)} ETH`);
```

---

## Events

### ArtMinted
```solidity
event ArtMinted(uint256 indexed tokenId, address indexed owner, string tokenURI)
```

Emitted when a new NFT is minted.

---

### ArtListed
```solidity
event ArtListed(uint256 indexed tokenId, uint256 price)
```

Emitted when an NFT is listed for sale.

---

### ArtUnlisted
```solidity
event ArtUnlisted(uint256 indexed tokenId)
```

Emitted when an NFT is unlisted from sale.

---

### ArtSold
```solidity
event ArtSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price)
```

Emitted when an NFT is sold.

---

## Frontend Integration

### Connect Wallet
```javascript
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);
```

### Mint NFT
```javascript
const mintNFT = async (imageUrl) => {
  try {
    const tx = await contract.mintArt(imageUrl);
    const receipt = await tx.wait();
    console.log('Minted!', receipt);
  } catch (error) {
    console.error('Minting failed:', error);
  }
};
```

### List NFT
```javascript
const listNFT = async (tokenId, priceInEth) => {
  try {
    const price = ethers.parseEther(priceInEth);
    const tx = await contract.listForSale(tokenId, price);
    await tx.wait();
    console.log('Listed!');
  } catch (error) {
    console.error('Listing failed:', error);
  }
};
```

### Buy NFT
```javascript
const buyNFT = async (tokenId) => {
  try {
    const price = await contract.tokenPrices(tokenId);
    const tx = await contract.buyArt(tokenId, { value: price });
    await tx.wait();
    console.log('Purchased!');
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};
```

### Listen to Events
```javascript
contract.on("ArtMinted", (tokenId, owner, tokenURI) => {
  console.log(`New NFT minted: #${tokenId} by ${owner}`);
});

contract.on("ArtSold", (tokenId, from, to, price) => {
  console.log(`NFT #${tokenId} sold for ${ethers.formatEther(price)} ETH`);
});
```

---

## OpenAI DALL-E Integration

### Generate Image

**⚠️ Security Note**: In production, this should be done through a backend API to keep your API key secure.

```javascript
const generateArt = async (prompt, options) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: options.size || "1024x1024",
        quality: options.quality || "standard",
        style: options.style || "vivid"
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data[0].url;
  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
};
```

### Parameters

- **prompt** (string, required): Text description of desired image
- **model** (string): "dall-e-3" or "dall-e-2"
- **n** (integer): Number of images (1-10 for DALL-E 2, only 1 for DALL-E 3)
- **size** (string): "1024x1024", "1024x1792", or "1792x1024"
- **quality** (string): "standard" or "hd" (DALL-E 3 only)
- **style** (string): "vivid" or "natural" (DALL-E 3 only)

### Response Format

```json
{
  "created": 1234567890,
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

---

## Error Handling

### Smart Contract Errors

```javascript
try {
  await contract.mintArt(uri);
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Not enough ETH for gas');
  } else if (error.code === 'ACTION_REJECTED') {
    console.error('Transaction rejected by user');
  } else {
    console.error('Transaction failed:', error.message);
  }
}
```

### Common Error Codes

- `INSUFFICIENT_FUNDS`: Not enough ETH for gas
- `ACTION_REJECTED`: User rejected transaction
- `UNPREDICTABLE_GAS_LIMIT`: Contract call will fail
- `NETWORK_ERROR`: Network connection issue

---

## Rate Limits

### OpenAI DALL-E
- Depends on your API tier
- Monitor usage in OpenAI dashboard
- Implement rate limiting on backend

### Ethereum Network
- No rate limits on transactions
- Gas costs may vary with network congestion
- Consider using gas price oracles

---

## Best Practices

1. **Always validate input** before sending transactions
2. **Show loading states** during async operations
3. **Handle errors gracefully** with user-friendly messages
4. **Estimate gas** before transactions
5. **Confirm transactions** before execution
6. **Listen to events** for real-time updates
7. **Cache data** when possible to reduce calls
8. **Use environment variables** for configuration

---

## Testing

### Local Testing
```bash
# Start local node
npx hardhat node

# Deploy contract
npx hardhat run scripts/deploy.ts --network localhost

# Run tests
npx hardhat test
```

### Testnet Testing
- Use Sepolia or Goerli testnet
- Get test ETH from faucets
- Deploy and test before mainnet

---

## Support

For API issues or questions:
- Check contract source code
- Review test files for examples
- Open a GitHub issue
- Consult Ethers.js and OpenAI documentation
