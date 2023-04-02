import React, { useState } from 'react'
import "./styles/Navbar.css"

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
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
            <button className="connect-button">Connect Wallet</button>
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