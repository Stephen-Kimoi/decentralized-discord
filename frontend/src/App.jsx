import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Server from '../components/Server';
import Channel from '../components/Channel';
import Messages from '../components/Messages';
import abi from '../abi/DecentDisc.json'; 
import config from '../config.json';


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [account, setAccount] = useState(); 
  const {walletConnected, setWalletConnected} = useState(false); 
  const [provider, setProvider] = useState(); 
  const [decentDisc, setDecentDisc] = useState(); 
  const [channels, setChannels] = useState([]); 

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); 
    setProvider(provider); 
    
    const network = await provider.getNetwork(); 
    
    const decentDisc = new ethers.Contract(config[network.chainId].DecentDisc.address, abi.abi, provider); 
    setDecentDisc(decentDisc); 

    const allChannels = await decentDisc.channelNo(); 
    const channels = []; 
    // console.log("Total channels: ", allChannels.toString()); 

    for (let i = 0; i <= allChannels; i++) {
      const channel = await decentDisc.getChannel(i); 
      channels.push(channel); 
    }

    setChannels(channels)

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
          provider={provider}
          account={account}
          decentDisc={decentDisc}
          channels={channels}
        /> 

        <Messages 
          handleToggleDarkMode={handleToggleDarkMode}
        /> 
      </main>

    </div>
  )
}

export default App
