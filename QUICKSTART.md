# Quick Start Guide

Get up and running with the Generative Art Creator in 5 minutes!

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [MetaMask](https://metamask.io/) browser extension
- [OpenAI API Key](https://platform.openai.com/api-keys)

## Installation (2 minutes)

```bash
# Clone the repository
git clone https://github.com/ashikbro/Generative-Art-Creator-with-NFTs.git
cd Generative-Art-Creator-with-NFTs

# Install dependencies
npm install
cd client && npm install && cd ..
```

## Configuration (1 minute)

1. Create environment file:
```bash
cd client
cp .env.example .env
```

2. Edit `client/.env` and add your OpenAI API key:
```
REACT_APP_OPENAI_API_KEY=sk-your-key-here
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

## Option 1: Art Generation Only (No Blockchain)

**Just want to generate art? Start here!**

```bash
cd client
npm start
```

Visit http://localhost:3000

✨ You can now generate AI art! (Minting requires blockchain setup)

## Option 2: Full Setup with Blockchain (2 minutes)

### Start Local Blockchain

Open a new terminal:
```bash
npx hardhat node
```

Keep this running! You'll see 20 test accounts with private keys.

### Deploy Smart Contract

Open another terminal:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Copy the contract address from output (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

### Update Configuration

Edit `client/.env`:
```
REACT_APP_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Configure MetaMask

1. Click MetaMask extension
2. Add Network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
3. Import Account:
   - Copy any private key from the Hardhat node terminal
   - MetaMask → Import Account → Paste private key

### Start the App

```bash
cd client
npm start
```

## Using the App

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve in MetaMask

### 2. Generate Art
- Enter prompt: "A futuristic city at sunset"
- Choose style and quality
- Click "Generate Art"
- Wait ~10 seconds

### 3. Mint NFT
- Click "Mint NFT" 
- Approve transaction in MetaMask
- Wait for confirmation
- See your NFT in "My NFTs"

### 4. List for Sale
- In "My NFTs", click "List for Sale"
- Enter price (e.g., 0.1 ETH)
- Confirm transaction
- NFT appears in Marketplace

### 5. Buy NFT (Optional)
- Use another MetaMask account
- View Marketplace
- Click "Buy"
- Confirm purchase

## Example Prompts

Try these to get started:
- "A serene mountain landscape at golden hour"
- "Abstract geometric shapes in vibrant colors"
- "A cyberpunk street scene with neon lights"
- "A peaceful Japanese garden with cherry blossoms"
- "Space exploration poster in retro style"

## Common Issues

### "Failed to connect wallet"
**Solution**: Install MetaMask and refresh page

### "Failed to generate art"  
**Solution**: Check your OpenAI API key in `.env`

### "Transaction failed"
**Solution**: Make sure Hardhat node is running and contract is deployed

### "Wrong network"
**Solution**: Switch MetaMask to Hardhat Local network

### App won't start
**Solution**: 
```bash
# Clear and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

## Testing the Contract

Run automated tests:
```bash
npx hardhat test
```

Expected output: All tests passing ✓

## Production Deployment

For deploying to testnet or mainnet, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [API.md](./API.md) - API documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines

## Cost Information

### Development (Free)
- Local blockchain: Free
- Test transactions: Free
- Test ETH: Free from faucets

### Production
- OpenAI DALL-E: $0.04 per standard image
- Ethereum gas: Varies ($1-50 per transaction)
- See OpenAI pricing for details

## What's Next?

1. **Customize**: Modify `client/src/App.js` to change UI
2. **Enhance**: Add features to smart contract
3. **Deploy**: Use testnet for testing, mainnet for production
4. **Share**: Show off your generated art!

## Need Help?

- 📖 [README.md](./README.md) - Full documentation
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- 🔌 [API.md](./API.md) - API reference
- 🐛 [GitHub Issues](https://github.com/ashikbro/Generative-Art-Creator-with-NFTs/issues)

## Quick Commands Reference

```bash
# Install dependencies
npm install && cd client && npm install

# Start local blockchain
npx hardhat node

# Deploy contract
npx hardhat run scripts/deploy.ts --network localhost

# Run tests
npx hardhat test

# Start frontend
cd client && npm start

# Build frontend
cd client && npm run build

# Compile contracts
npx hardhat compile
```

## Tips for Success

1. **Start Simple**: Generate art first, add blockchain later
2. **Test First**: Use local blockchain before testnet
3. **Save Keys**: Keep your API keys and private keys safe
4. **Read Docs**: Check README.md for detailed information
5. **Ask Questions**: Open GitHub issues for help

## Congratulations! 🎉

You're now ready to create and mint generative art NFTs!

Happy creating! 🎨✨
