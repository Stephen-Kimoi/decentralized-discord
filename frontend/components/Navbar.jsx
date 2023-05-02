import "./styles/Navbar.css"; 
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ethers } from "ethers";
import { useDisconnect } from "wagmi";
import { logout } from "./WalletConnection/SignInEmail";

// import { socialLogin, socialLogout, getUser } from "../src/paper.js";

// import { UserStatus } from "@paperxyz/embedded-wallet-service-sdk";

const Navbar = ({ 
  account, 
  walletConnected, 
  setAccount, 
  isDarkMode, 
  handleToggleDarkMode, 
  setWalletConnected, 
  setPaperWallet, 
  paperWallet, 
  currentUser, 
  updateUser, 
  handleOpen, 
  isConnected, 
  address, 
  client, 
  WagmiConfig,
  signedUpWithWagmi, 
  signedUpWithEmail, 
  setSignedUpWithEmail }) => {
  const [connected, toggleConnect] = useState(false);
  const { disconnect } = useDisconnect(); 
  // const location = useLocation();
  // const [currentAddress, updateAddress] = useState('0x');
  // const [currentUser, updateUser] = useState(null);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }); 
    const account = ethers.utils.getAddress(accounts[0]); 
    console.log(account.slice(0, 6)); 
    setAccount(account);
  }


  const handleWagmiDisconnect = () => {
    try {
      disconnect(); 
      console.log("Account disconnected!"); 
    } catch (error){
      console.error(error)
    }
  }

  const handleEmailDisconnect = () => {
    try {
      logout(); 
      setAccount(""); 
      setSignedUpWithEmail(false); 
      console.log("Email disconnect!")
    } catch (error){
      console.error(error)
    }
  }

  useEffect( () => {
    // setUser();
    // async () => {
    //   await getUser().then((user) => {
    //     console.log(`User ${user.walletAddress} connected`)
    //   }); 
    // }
    // loadBlockchainData(); 
  }, [currentUser]);

  return (
    <WagmiConfig client={client}>
    <nav className={`navbar ${isDarkMode ? "dark" : "light"}`}>
      <div className="navbar-container">

        <div className="logo-container">
          {/* <img src="/path/to/logo.png" alt="DecentDisc Logo" className="logo" /> */}
          <h1 className="logo-text">DecentDisc</h1>
        </div>
        
        <div className='end-container'>
          <div className="button-container">
            { 
              account || isConnected ? (
                <button 
                  className="connect-button"
                >
                  {
                    account ? account.slice(0,6) + "..." + account.slice(38,42) :  
                    address.slice(0,6) + "..." + address.slice(38,42) 
                  }
                  {/* {account.slice(0,6) }...{ account.slice(38,42)} */}
                </button>
              ) : (
                <button 
                  className="connect-button"
                  onClick={handleOpen}
                >
                  Connect Wallet
                </button>
              )
            }
          </div>

          {
            signedUpWithWagmi  && (
              <button className="node-toggle-button" onClick={handleWagmiDisconnect}>
                Disconnect
              </button>
            )
          }

          {
            signedUpWithEmail && (
              <button className="node-toggle-button" onClick={handleEmailDisconnect}>
                  Disconnect
              </button>
            )
          }
        
          <button className='node-toggle-button' onClick={handleToggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

      </div>
    </nav>
    </WagmiConfig>
  )
}

export default Navbar