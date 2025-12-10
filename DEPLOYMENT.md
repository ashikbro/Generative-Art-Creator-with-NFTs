# Deployment Guide

This guide will walk you through deploying the Generative Art NFT platform.

## Prerequisites

- Node.js v14+ installed
- MetaMask wallet with test ETH
- OpenAI API key
- Access to Ethereum testnet (e.g., Sepolia)

## Step 1: Clone and Install

```bash
git clone https://github.com/ashikbro/Generative-Art-Creator-with-NFTs.git
cd Generative-Art-Creator-with-NFTs
npm install
cd client && npm install && cd ..
```

## Step 2: Get OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again)

## Step 3: Configure Environment Variables

Create `client/.env` file:

```bash
cd client
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
REACT_APP_OPENAI_API_KEY=sk-your-api-key-here
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

## Step 4: Deploy Smart Contract

### Option A: Local Deployment (for testing)

1. Start local Hardhat node:
```bash
npx hardhat node
```

2. In a new terminal, deploy:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

3. Copy the deployed contract address
4. Update `client/.env`:
```
REACT_APP_CONTRACT_ADDRESS=0xYourContractAddress
```

5. In MetaMask:
   - Add network: Localhost 8545
   - Import account using one of the private keys shown by Hardhat node

### Option B: Testnet Deployment (Sepolia)

1. Get Sepolia ETH from a faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. Get an RPC URL:
   - Sign up at https://www.alchemy.com/ or https://infura.io/
   - Create a new app/project
   - Copy the RPC URL

3. Update `hardhat.config.ts`:
```typescript
import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.20",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    sepolia: {
      url: "YOUR_ALCHEMY_SEPOLIA_URL",
      accounts: ["YOUR_PRIVATE_KEY_WITHOUT_0x_PREFIX"]
    }
  }
});
```

4. Deploy:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

5. Copy the deployed contract address
6. Update `client/.env`

7. In MetaMask:
   - Make sure you're on Sepolia network
   - Ensure you have test ETH

## Step 5: Run the Application

```bash
cd client
npm start
```

The app will open at http://localhost:3000

## Step 6: Test the Application

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve in MetaMask
   - Verify correct network

2. **Generate Art**
   - Enter a prompt: "A futuristic city at sunset"
   - Select style and quality
   - Click "Generate Art"
   - Wait for DALL-E to create the image

3. **Mint NFT**
   - After art is generated, click "Mint NFT"
   - Approve transaction in MetaMask
   - Wait for confirmation
   - NFT appears in "My NFTs"

4. **List for Sale**
   - In "My NFTs", click "List for Sale"
   - Enter price in ETH
   - Confirm transaction
   - NFT appears in Marketplace

5. **Buy NFT**
   - Use another account (or ask someone)
   - View Marketplace
   - Click "Buy" on a listed NFT
   - Confirm transaction

## Production Deployment

### Frontend (Vercel/Netlify)

1. Build the app:
```bash
cd client
npm run build
```

2. Deploy the `build` folder to your hosting service

3. Set environment variables on hosting platform:
   - `REACT_APP_OPENAI_API_KEY`
   - `REACT_APP_CONTRACT_ADDRESS`

### Backend API (Recommended for Production)

**⚠️ Security Note**: Do NOT expose OpenAI API key in frontend!

Create a backend API to handle DALL-E requests:

```javascript
// Example Express.js endpoint
app.post('/api/generate-art', async (req, res) => {
  const { prompt, style, quality, size } = req.body;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    style,
    quality,
    size,
    n: 1
  });
  
  res.json({ imageUrl: response.data[0].url });
});
```

Update frontend to call your API instead of OpenAI directly.

### Smart Contract (Mainnet)

**⚠️ Warning**: Deploying to mainnet costs real ETH!

1. Thoroughly test on testnet
2. Get security audit (recommended)
3. Update hardhat.config.ts with mainnet configuration
4. Deploy: `npx hardhat run scripts/deploy.ts --network mainnet`
5. Verify contract on Etherscan

## Troubleshooting

### "Failed to connect wallet"
- Install MetaMask
- Unlock MetaMask
- Refresh page

### "Failed to generate art"
- Check OpenAI API key
- Verify API credits
- Check prompt follows OpenAI guidelines

### "Transaction failed"
- Insufficient gas
- Wrong network
- Contract not deployed

### "Build errors"
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Cost Estimates

### Testnet (Free)
- Smart contract deployment: Free (test ETH)
- NFT minting: Free (test ETH)
- Transactions: Free (test ETH)

### Mainnet
- Smart contract deployment: ~$50-200 (varies with gas)
- NFT minting: ~$10-50 per mint
- Listing/buying: ~$5-30 per transaction

### OpenAI DALL-E
- Standard quality: $0.040 per image
- HD quality: $0.080 per image

## Next Steps

1. Add IPFS integration for decentralized storage
2. Implement backend API for API key security
3. Add more customization options
4. Create collection management
5. Add auction functionality
6. Implement royalty system

## Support

- GitHub Issues: Report bugs and request features
- Documentation: Check README.md
- Smart Contract: Review contracts/GenerativeArtNFT.sol
