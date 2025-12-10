# Generative Art Creator with NFTs

A generative art platform where users create, customize, and tokenize artwork as NFTs using OpenAI's DALL-E and Ethereum blockchain.

## Features

- 🎨 **AI Art Generation**: Create unique artwork using OpenAI DALL-E with customizable settings
- 🖼️ **Style Customization**: Choose between vivid and natural styles
- ⚙️ **Quality Options**: Select standard or HD quality
- 📐 **Size Options**: Multiple aspect ratios (square, portrait, landscape)
- 🔗 **Ethereum Integration**: Mint generated artwork as NFTs on the blockchain
- 💰 **NFT Marketplace**: List, buy, and sell NFTs
- 👛 **MetaMask Support**: Connect your wallet to interact with the blockchain
- 🎯 **OpenZeppelin Contracts**: Secure, audited smart contracts

## Technology Stack

### Frontend
- **React.js**: User interface
- **Ethers.js**: Ethereum blockchain interaction
- **Axios**: HTTP client for API calls
- **OpenAI API**: DALL-E art generation

### Smart Contracts
- **Solidity**: Smart contract language
- **Hardhat**: Development environment
- **OpenZeppelin**: Secure contract libraries (ERC721, Ownable)

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- OpenAI API key
- Ethereum wallet with test ETH (for testing)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashikbro/Generative-Art-Creator-with-NFTs.git
   cd Generative-Art-Creator-with-NFTs
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `client` directory:
   ```bash
   cp client/.env.example client/.env
   ```
   
   Edit `client/.env` and add your keys:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address_here
   ```

## Smart Contract Deployment

1. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

2. **Deploy to local network**
   
   Start local Hardhat node:
   ```bash
   npx hardhat node
   ```
   
   In a new terminal, deploy:
   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

3. **Deploy to testnet (e.g., Sepolia)**
   
   Update `hardhat.config.ts` with your network configuration:
   ```typescript
   networks: {
     sepolia: {
       url: "YOUR_ALCHEMY_OR_INFURA_URL",
       accounts: ["YOUR_PRIVATE_KEY"]
     }
   }
   ```
   
   Deploy:
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

4. **Update contract address**
   
   Copy the deployed contract address and update `client/.env`:
   ```
   REACT_APP_CONTRACT_ADDRESS=0x...
   ```

## Running the Application

1. **Start the frontend**
   ```bash
   cd client
   npm start
   ```
   
   The application will open at `http://localhost:3000`

2. **Connect MetaMask**
   - Click "Connect Wallet" button
   - Approve the connection in MetaMask
   - Ensure you're on the correct network

## Usage

### Generating Art

1. Enter a descriptive prompt for your artwork
2. Select style (vivid or natural)
3. Choose quality (standard or HD)
4. Select size/aspect ratio
5. Click "Generate Art"
6. Wait for the AI to create your artwork

### Minting NFTs

1. After generating art, click "Mint NFT"
2. Approve the transaction in MetaMask
3. Wait for blockchain confirmation
4. Your NFT will appear in "My NFTs" section

### Listing NFTs for Sale

1. In "My NFTs" section, click "List for Sale"
2. Enter price in ETH
3. Confirm the transaction
4. NFT will appear in the Marketplace

### Buying NFTs

1. Browse the Marketplace section
2. Click "Buy" on desired NFT
3. Confirm transaction with sufficient ETH
4. NFT will transfer to your wallet

## Smart Contract Functions

The `GenerativeArtNFT.sol` contract includes:

- `mintArt(tokenURI)`: Mint new NFT
- `listForSale(tokenId, price)`: List NFT for sale
- `unlistFromSale(tokenId)`: Remove listing
- `buyArt(tokenId)`: Purchase listed NFT
- `tokensOfOwner(address)`: Get all NFTs owned by address
- `totalSupply()`: Get total minted NFTs

## Security Considerations

⚠️ **Important**: 
- Never commit `.env` files with real API keys
- Use environment variables for sensitive data
- In production, implement a backend API to handle OpenAI requests
- Thoroughly test smart contracts before mainnet deployment
- Consider using IPFS for decentralized image storage

## Project Structure

```
Generative-Art-Creator-with-NFTs/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── App.css         # Styling
│   │   └── index.js        # Entry point
│   ├── .env.example        # Environment template
│   └── package.json
├── contracts/              # Smart contracts
│   └── GenerativeArtNFT.sol
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── test/                   # Contract tests
├── hardhat.config.ts       # Hardhat configuration
├── package.json
└── README.md
```

## Development

### Adding Tests

Create test files in the `test/` directory:

```javascript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("GenerativeArtNFT", function () {
  it("Should mint a new NFT", async function () {
    // Test implementation
  });
});
```

Run tests:
```bash
npx hardhat test
```

### Code Coverage

```bash
npx hardhat coverage
```

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed and unlocked
- Check you're on the correct network
- Try refreshing the page

### Contract Interaction Errors
- Verify contract address is correct
- Ensure you have sufficient ETH for gas
- Check network connection

### DALL-E API Errors
- Verify API key is valid
- Check API rate limits
- Ensure prompt follows OpenAI guidelines

## Future Enhancements

- [ ] IPFS integration for decentralized storage
- [ ] Backend API for secure key management
- [ ] Additional art generation models
- [ ] Auction functionality
- [ ] Royalty system for artists
- [ ] Social features (likes, comments)
- [ ] Collection management
- [ ] Advanced filtering and search

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Acknowledgments

- OpenAI for DALL-E API
- OpenZeppelin for secure contract templates
- Hardhat for development tools
- React community for frontend framework

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review smart contract code

## Disclaimer

This project is for educational purposes. Always conduct thorough security audits before deploying to mainnet. Use at your own risk.

