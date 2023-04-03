import React, { useState } from 'react'
import { ethers } from 'ethers';
import "./styles/Navbar.css"

const Navbar = ({ account, walletConnected, setAccount, isDarkMode, handleToggleDarkMode }) => {

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }); 
    const account = ethers.utils.getAddress(accounts[0]); 
    console.log(account.slice(0, 6)); 
    setAccount(account); 
  }

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