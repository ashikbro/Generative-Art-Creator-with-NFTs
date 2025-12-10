import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './App.css';

function App() {
  // State variables
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('vivid');
  const [quality, setQuality] = useState('standard');
  const [size, setSize] = useState('1024x1024');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myNFTs, setMyNFTs] = useState([]);
  const [allNFTs, setAllNFTs] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const [listPrice, setListPrice] = useState('');
  const [currentTokenId, setCurrentTokenId] = useState(null);

  // Contract ABI (simplified - would be imported from compiled contract)
  const contractABI = [
    "function mintArt(string memory tokenURI) public returns (uint256)",
    "function listForSale(uint256 tokenId, uint256 price) public",
    "function unlistFromSale(uint256 tokenId) public",
    "function buyArt(uint256 tokenId) public payable",
    "function tokensOfOwner(address owner) public view returns (uint256[])",
    "function tokenURI(uint256 tokenId) public view returns (string)",
    "function listedForSale(uint256) public view returns (bool)",
    "function tokenPrices(uint256) public view returns (uint256)",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function totalSupply() public view returns (uint256)"
  ];

  // Contract address - would be set after deployment
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask to use this application');
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      
      setAccount(accounts[0]);
      
      // Initialize contract if address is set
      if (contractAddress !== "0x0000000000000000000000000000000000000000") {
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(nftContract);
        loadNFTs(nftContract, accounts[0]);
      }
      
      setSuccess('Wallet connected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  // Generate art using OpenAI DALL-E
  const generateArt = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Note: In production, this should call a backend API to keep the API key secure
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your .env file');
      }

      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: size,
          quality: quality,
          style: style
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const imageUrl = response.data.data[0].url;
      setGeneratedImage(imageUrl);
      setSuccess('Art generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to generate art: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Mint NFT
  const mintNFT = async () => {
    if (!contract) {
      setError('Please connect your wallet first');
      return;
    }

    if (!generatedImage) {
      setError('Please generate art first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In production, you would upload the image to IPFS and create metadata
      // For now, we'll use the image URL directly as the tokenURI
      const tokenURI = generatedImage;
      
      const tx = await contract.mintArt(tokenURI);
      await tx.wait();
      
      setSuccess('NFT minted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload NFTs
      loadNFTs(contract, account);
    } catch (err) {
      setError('Failed to mint NFT: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // List NFT for sale
  const listNFTForSale = async () => {
    if (!contract || !currentTokenId) return;

    setLoading(true);
    setError('');

    try {
      const priceInWei = ethers.parseEther(listPrice);
      const tx = await contract.listForSale(currentTokenId, priceInWei);
      await tx.wait();
      
      setSuccess('NFT listed for sale!');
      setTimeout(() => setSuccess(''), 3000);
      setShowListModal(false);
      setListPrice('');
      
      // Reload NFTs
      loadNFTs(contract, account);
    } catch (err) {
      setError('Failed to list NFT: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Unlist NFT
  const unlistNFT = async (tokenId) => {
    if (!contract) return;

    setLoading(true);
    setError('');

    try {
      const tx = await contract.unlistFromSale(tokenId);
      await tx.wait();
      
      setSuccess('NFT unlisted!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload NFTs
      loadNFTs(contract, account);
    } catch (err) {
      setError('Failed to unlist NFT: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buy NFT
  const buyNFT = async (tokenId, price) => {
    if (!contract) return;

    setLoading(true);
    setError('');

    try {
      const tx = await contract.buyArt(tokenId, { value: price });
      await tx.wait();
      
      setSuccess('NFT purchased successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload NFTs
      loadNFTs(contract, account);
    } catch (err) {
      setError('Failed to buy NFT: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load NFTs
  const loadNFTs = async (nftContract, userAccount) => {
    try {
      const totalSupply = await nftContract.totalSupply();
      const myTokens = await nftContract.tokensOfOwner(userAccount);
      
      // Load user's NFTs
      const myNFTData = await Promise.all(
        myTokens.map(async (tokenId) => {
          const uri = await nftContract.tokenURI(tokenId);
          const isListed = await nftContract.listedForSale(tokenId);
          const price = await nftContract.tokenPrices(tokenId);
          
          return {
            tokenId: tokenId.toString(),
            image: uri,
            isListed,
            price: price.toString()
          };
        })
      );
      
      setMyNFTs(myNFTData);
      
      // Load all NFTs that are listed for sale
      const allListedNFTs = [];
      for (let i = 1; i <= totalSupply; i++) {
        const isListed = await nftContract.listedForSale(i);
        if (isListed) {
          const uri = await nftContract.tokenURI(i);
          const price = await nftContract.tokenPrices(i);
          const owner = await nftContract.ownerOf(i);
          
          if (owner.toLowerCase() !== userAccount.toLowerCase()) {
            allListedNFTs.push({
              tokenId: i.toString(),
              image: uri,
              price: price.toString(),
              owner
            });
          }
        }
      }
      
      setAllNFTs(allListedNFTs);
    } catch (err) {
      console.error('Failed to load NFTs:', err);
    }
  };

  // Download image
  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-art.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open list modal
  const openListModal = (tokenId) => {
    setCurrentTokenId(tokenId);
    setShowListModal(true);
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🎨 Generative Art Creator & NFT Marketplace</h1>
          <button 
            className="wallet-button" 
            onClick={connectWallet}
            disabled={account}
          >
            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Main Content */}
        <div className="main-content">
          {/* Art Generation Form */}
          <div className="card">
            <h2>Generate Art</h2>
            <div className="form-group">
              <label>Prompt</label>
              <textarea
                placeholder="Describe the art you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="vivid">Vivid</option>
                <option value="natural">Natural</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Quality</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                <option value="standard">Standard</option>
                <option value="hd">HD</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="1024x1024">1024x1024</option>
                <option value="1024x1792">1024x1792 (Portrait)</option>
                <option value="1792x1024">1792x1024 (Landscape)</option>
              </select>
            </div>
            
            <button 
              className="generate-button" 
              onClick={generateArt}
              disabled={loading || !prompt}
            >
              {loading ? 'Generating...' : 'Generate Art'}
            </button>
          </div>

          {/* Preview Section */}
          <div className="card preview-section">
            <h2>Preview</h2>
            {generatedImage ? (
              <>
                <img 
                  src={generatedImage} 
                  alt="Generated Art" 
                  className="artwork-preview"
                />
                <div className="action-buttons">
                  <button 
                    className="download-button" 
                    onClick={downloadImage}
                  >
                    Download
                  </button>
                  <button 
                    className="mint-button" 
                    onClick={mintNFT}
                    disabled={loading || !account}
                  >
                    Mint NFT
                  </button>
                </div>
              </>
            ) : (
              <div className="placeholder">
                {loading ? 'Generating your art...' : 'Your generated art will appear here'}
              </div>
            )}
          </div>
        </div>

        {/* My NFTs Gallery */}
        {account && myNFTs.length > 0 && (
          <div className="gallery">
            <h2>My NFTs</h2>
            <div className="nft-grid">
              {myNFTs.map((nft) => (
                <div key={nft.tokenId} className="nft-card">
                  <img src={nft.image} alt={`NFT ${nft.tokenId}`} className="nft-image" />
                  <div className="nft-info">
                    <p><strong>Token ID:</strong> {nft.tokenId}</p>
                    {nft.isListed && (
                      <p><strong>Price:</strong> {ethers.formatEther(nft.price)} ETH</p>
                    )}
                  </div>
                  <div className="nft-actions">
                    {nft.isListed ? (
                      <button 
                        className="unlist-button"
                        onClick={() => unlistNFT(nft.tokenId)}
                        disabled={loading}
                      >
                        Unlist
                      </button>
                    ) : (
                      <button 
                        className="list-button"
                        onClick={() => openListModal(nft.tokenId)}
                        disabled={loading}
                      >
                        List for Sale
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Marketplace */}
        {account && allNFTs.length > 0 && (
          <div className="gallery">
            <h2>Marketplace</h2>
            <div className="nft-grid">
              {allNFTs.map((nft) => (
                <div key={nft.tokenId} className="nft-card">
                  <img src={nft.image} alt={`NFT ${nft.tokenId}`} className="nft-image" />
                  <div className="nft-info">
                    <p><strong>Token ID:</strong> {nft.tokenId}</p>
                    <p><strong>Price:</strong> {ethers.formatEther(nft.price)} ETH</p>
                    <p><strong>Owner:</strong> {nft.owner.substring(0, 6)}...{nft.owner.substring(38)}</p>
                  </div>
                  <div className="nft-actions">
                    <button 
                      className="buy-button"
                      onClick={() => buyNFT(nft.tokenId, nft.price)}
                      disabled={loading}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List Modal */}
        {showListModal && (
          <div className="modal" onClick={() => setShowListModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>List NFT for Sale</h3>
              <div className="form-group">
                <label>Price (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.1"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                />
              </div>
              <div className="modal-buttons">
                <button 
                  className="confirm-button"
                  onClick={listNFTForSale}
                  disabled={loading || !listPrice}
                >
                  List
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setShowListModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
