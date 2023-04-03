import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Server from '../components/Server';
import Channel from '../components/Channel';
import Messages from '../components/Messages';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [account, setAccount] = useState(); 
  const {walletConnected, setWalletConnected} = useState(false); 

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
  }

  const loadBlockchainData = async () => {
    window.ethereum.on('accountsChanged', function () {
      window.location.reload()
    })
  } 

  useEffect( () => {
    loadBlockchainData()
  }, [account])

  return (
    <div className="App">
      <Navbar 
        account={account} 
        walletConnected={walletConnected} 
        setAccount={setAccount} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        handleToggleDarkMode={handleToggleDarkMode}
      /> 
      
      <main className={`${isDarkMode ? "dark" : " "}`}>
        <Server 
          handleToggleDarkMode={handleToggleDarkMode}
        /> 

        <Channel 
          handleToggleDarkMode={handleToggleDarkMode}
        /> 

        <Messages 
          handleToggleDarkMode={handleToggleDarkMode}
        /> 
      </main>

    </div>
  )
}

export default App
