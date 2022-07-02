import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';

// Constants
const TWITTER_HANDLE = 'owanikin';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Just a state variable we use to store our user's public wallet. Don't forget to import useState.
  const [currentAccount, setCurrentAccount] = useState(null);

  const [characterNFT, setCharacterNFT] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  // Actions that will run on component load. Since it will take some time, we should declare it as async
  const checkIfWalletIsConnected = async () => {
      try {
        // Make sure we have access to window.ethereum
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
        } else {
          console.log("We have the ethereum object", ethereum);
          
          // Check if we're authorized to access the user's wallet.
          const accounts = await ethereum.request({ method: 'eth_accounts' });

          // User can have multiple authorized accounts, we grab the first one if its there!
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
          } else {
            console.log('No authorized account found');
          }
        }
      } catch (error) {
        console.log(error);
      }  
  };

  const renderContent = () => {

    // If the app is currently loading, just render out LoadingIndicator
    if (isLoading) {
      return <LoadingIndicator />
    }
    
    // If user has not connected to app, show Connect To Wallet
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
            <button className="cta-button connect-wallet-button" onClick={connectWalletAction}>
              Connect Wallet To Get Started
            </button>
        </div>
      ); 
      // If user has connected to app, and does not have a character NFT. Show SelectCharacter Component
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />

      // If there is a connected wallet and characterNFT, its time to baller!
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }
  };

  // Implementing your connectWallet method here
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        // We set isLoading here because we use return in the next line
        setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
      // Request method access to account.
      // const accounts = await ethereum.request({
      //   method: 'eth_requestAccounts',
      // });

      // // This should print out public address once we authorize Metamask.
      // console.log('Connected', accounts[0]);
      // setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();

    const checkNetwork = async () => {
      try {
        if (window.ethereum.networkVersion !== '4') {
          alert("Please connect to Rinkeby!")
        }
      } catch(error) {
        console.log(error)
      }
    }
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {

    // Function that will interact with our smart contract.
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(characterNFT));
      }
      setIsLoading(false);

      // const txn = await gameContract.checkIfUserHasNFT();
      // if (txn.name) {
      //   console.log("User has character NFT");
      //   setCharacterNFT(transformCharacterData(txn));
      // } else {
      //   console.log('No character NFT found');
      // }
    };

    // We only want to run this, if we have a connected wallet
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Mortal Kombat ⚔️</p>
          <p className="sub-text">Team up to protect the Mortals!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
