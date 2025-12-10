# Contributing to Generative Art Creator with NFTs

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature is already requested
- Clearly describe the feature
- Explain the use case
- Consider implementation details

### Code Contributions

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Generative-Art-Creator-with-NFTs.git
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation

5. **Test your changes**
   ```bash
   # Test smart contracts
   npx hardhat test
   
   # Test frontend
   cd client && npm test
   
   # Build frontend
   npm run build
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of changes"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Describe your changes
   - Reference related issues
   - Wait for review

## Development Guidelines

### Code Style

#### Solidity
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for functions
- Keep functions focused and small
- Use OpenZeppelin contracts when possible

```solidity
/**
 * @dev Mint a new NFT with the given token URI
 * @param tokenURI The URI containing the metadata for the NFT
 * @return The token ID of the newly minted NFT
 */
function mintArt(string memory tokenURI) public returns (uint256) {
    // Implementation
}
```

#### JavaScript/React
- Use functional components
- Meaningful variable names
- Add comments for complex logic
- Keep components focused

```javascript
// Good
const generateArt = async () => {
  // Implementation
};

// Avoid
const doStuff = async () => {
  // Implementation
};
```

### Testing

#### Smart Contracts
- Write comprehensive tests
- Test edge cases
- Test access control
- Test failure scenarios

```typescript
describe("GenerativeArtNFT", function () {
  it("Should mint a new NFT", async function () {
    // Test implementation
  });
  
  it("Should fail if non-owner tries to list", async function () {
    // Test implementation
  });
});
```

#### Frontend
- Test user interactions
- Test error handling
- Test wallet connections

### Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add auction functionality for NFTs
fix: resolve MetaMask connection issue
docs: update deployment guide
test: add tests for listing functionality
```

## Project Structure

```
Generative-Art-Creator-with-NFTs/
├── client/              # React frontend
│   ├── src/
│   │   ├── App.js      # Main component
│   │   ├── App.css     # Styles
│   │   └── index.js    # Entry point
│   └── public/
├── contracts/          # Solidity contracts
│   └── GenerativeArtNFT.sol
├── scripts/            # Deployment scripts
│   └── deploy.ts
├── test/              # Contract tests
│   └── GenerativeArtNFT.test.ts
└── hardhat.config.ts  # Hardhat configuration
```

## Areas for Contribution

### High Priority
- [ ] IPFS integration for image storage
- [ ] Backend API for secure API key management
- [ ] Improved error handling
- [ ] Loading states and animations
- [ ] Mobile responsiveness improvements

### Medium Priority
- [ ] Auction functionality
- [ ] Royalty system
- [ ] Collection management
- [ ] Social features (likes, comments)
- [ ] Search and filtering
- [ ] User profiles

### Low Priority
- [ ] Dark mode
- [ ] Multiple language support
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Advanced customization options

## Security Guidelines

### Smart Contracts
- Never store sensitive data on-chain
- Use `require` statements for validation
- Follow checks-effects-interactions pattern
- Be aware of reentrancy attacks
- Test thoroughly before mainnet deployment

### Frontend
- Never expose API keys in frontend code
- Validate user input
- Sanitize data before display
- Use environment variables for configuration
- Implement rate limiting for API calls

### API Keys
- Use environment variables
- Never commit `.env` files
- Implement backend API for sensitive operations
- Rotate keys regularly
- Use minimum required permissions

## Getting Help

- **Questions**: Open a discussion on GitHub
- **Bugs**: Open an issue
- **Security**: Email security concerns privately
- **Chat**: Join our Discord/Telegram (if available)

## Code Review Process

1. **Automated checks**: CI/CD runs tests and linting
2. **Peer review**: At least one maintainer reviews
3. **Testing**: Changes are tested locally
4. **Approval**: Maintainer approves PR
5. **Merge**: Changes are merged to main branch

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commits

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Questions?

Feel free to ask questions by opening an issue or discussion. We're here to help!

Thank you for contributing! 🎨🚀
