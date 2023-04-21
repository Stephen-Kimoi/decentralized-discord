import "./styles/Navbar.css"; 
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useState } from "react";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

// const providerOptions = {
//   coinbasewallet: {
//     // package: CoinbaseWalletSDK,  
//     options: {
//       appName: "Decentralized Discord", 
//       infuraId: "https://sepolia.infura.io/v3/0b669b0be4fe45a5993838d765cbdf0d",  //**REMOVE API KEY
//       chainId: 11155111
//     }
//   }
// }


const Navbar = ({ account, walletConnected, setAccount, isDarkMode, handleToggleDarkMode }) => {
  
  // const providerOptions = {
  //   binancechainwallet: {
  //     package: true,
  //   },
    // walletconnect: {
    //   package: WalletConnect, // required
    //   options: {
    //     infuraId:  process.env.INFURA_ID// required
    //   }
    // },
  
    // coinbasewallet: {
    //   package: CoinbaseWalletSDK, // Required
    //   options: {
    //     appName: "Coinbase", // Required
    //     infuraId: "https://sepolia.infura.io/v3/0b669b0be4fe45a5993838d765cbdf0d", // Required
    //     chainId: 11155111, //4 for Rinkeby, 1 for mainnet (default)
    //   },
    // },
  // };

  // const web3Modal = new Web3Modal({
  //   network: "sepolia",
  //   theme: "light", // optional, 'dark' / 'light',
  //   cacheProvider: false, // optional
  //   providerOptions: {}// required
  // });

  // const connectWeb3Wallet = async () => {
  //   try {
  //     const web3Provider = await web3Modal.connect();
  //     const library = new ethers.providers.Web3Provider(web3Provider);
  //     const web3Accounts = await library.listAccounts();
  //     setConnectedAccount(web3Accounts[0]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const disconnectWeb3Modal = async () => {
  //   await web3Modal.clearCachedProvider();
  //   setConnectedAccount("");
  // };

  // let web3modal = new Web3Modal({
  //   network: "sepolia", 
  //   theme: "light", 
  //   cacheProvider: false, 
  //   providerOptions: {}
  // }); 

  // const connectWallet = async () => {
  //   // const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }); 
  //   // const account = ethers.utils.getAddress(accounts[0]); 
  //   // console.log(account.slice(0, 6)); 
  //   // setAccount(account);

  //   // const web3ModalInstance = await web3modal.connect(); 
  //   // const web3ModalProvider = await new ethers.providers.Web3Provider(web3ModalInstance); 
  //   // console.log("Provider: ", web3ModalProvider); 

  //   try {
  //     const web3Provider = await web3modal.connect();
  //     const library = new ethers.providers.Web3Provider(web3Provider);
  //     const web3Accounts = await library.listAccounts();
  //     const network = await library.getNetwork();
  //     console.log(web3Accounts[0].slice(0, 6)); 
  //     setAccount(web3Accounts[0]);

  //     console.log("Network : ", network); 
  //     console.log("Metamask wallet account: ", web3Accounts); 
  //   // setConnectedAccount(web3Accounts[0]);
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const destroyWalletConnection = async () => {
  //   await web3modal.clearCachedProvider(); 
  // }

  return (
    <nav className={`navbar ${isDarkMode ? "dark" : "light"}`}>
      <div className="navbar-container">

        <div className="logo-container">
          {/* <img src="/path/to/logo.png" alt="DecentDisc Logo" className="logo" /> */}
          <h1 className="logo-text">DecentDisc</h1>
        </div>
        
        <div className='end-container'>
          <div className="button-container">
            { 
              account ? (
                <button 
                  className="connect-button"
                >
                  {account.slice(0,6) }...{ account.slice(38,42)}
                </button>
              ) : (
                <button 
                  className="connect-button"
                  onClick={connectWeb3Wallet}
                >
                  Connect Wallet
                </button>
              )
            }
          </div>
        
          <button className='node-toggle-button' onClick={handleToggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar