import "./styles/Navbar.css"; 
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ethers } from "ethers";

import { socialLogin, socialLogout, getUser } from "../src/paper.js";

import { UserStatus } from "@paperxyz/embedded-wallet-service-sdk";


const Navbar = ({ account, walletConnected, setAccount, isDarkMode, handleToggleDarkMode, setWalletConnected }) => {
  const [connected, toggleConnect] = useState(false);
  // const location = useLocation();
  // const [currentAddress, updateAddress] = useState('0x');
  const [currentUser, updateUser] = useState(null);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }); 
    const account = ethers.utils.getAddress(accounts[0]); 
    console.log(account.slice(0, 6)); 
    setAccount(account);
  }

  async function connectWithPaperWallet() {
    try {
      await socialLogin().then((user) => {
        console.log("Users wallet address is: ", user.walletAddress); 
        if (UserStatus.LOGGED_IN_WALLET_INITIALIZED === user.status) {
          setUser();
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function logout() {
    try {
      await socialLogout().then(() => {
        setUser();
      });
    } catch (error) {
      console.log(error);
    };
  }

  async function setUser() {
    try {
      await getUser().then((user) => {
        if (user.status === UserStatus.LOGGED_OUT) {
          console.log(`User not logged in!`)
          toggleConnect(false);
          updateUser(null);
          updateAddress('0x');
          return;
        }
        console.log(`User ${user.walletAddress} logged in!`)
        updateUser(user);
        setAccount(user.walletAddress);
        setWalletConnected(true); 
        toggleConnect(true);
      })
    } catch (error) {
      console.error(error);
    }
  }

  useEffect( () => {
    // setUser();
    async () => {
      await getUser().then((user) => {
        console.log(`User ${user.walletAddress} connected`)
      }); 
    }
  }, [currentUser]);

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
                  onClick={connectWallet}
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