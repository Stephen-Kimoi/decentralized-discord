import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Server from '../components/Server';
import Channel from '../components/Channel';
import Messages from '../components/Messages';
import { abi as contractAbi } from '../abi/DecentDisc.json'; 
import { abi as tokenAbi } from "../abi/DecentDiscToken.json"
import config from '../config.json';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3030'); 


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [account, setAccount] = useState(); 
  const {walletConnected, setWalletConnected} = useState(false); 
  const [provider, setProvider] = useState(); 
  const [decentDisc, setDecentDisc] = useState(); 
  const [channels, setChannels] = useState([]); 
  const [currentChannel, setCurrentChannel] = useState(null); 
  const [messages, setMessages] = useState([]); 

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); 
    setProvider(provider); 
    
    const network = await provider.getNetwork(); 
    const signer = await provider.getSigner(); 
    const address = await signer.getAddress();
    
    const tokens = (n) => {
      return ethers.utils.parseUnits(n.toString(), "ether")
    } 
    
    const decentDisc = new ethers.Contract(config[network.chainId].DecentDisc.address, contractAbi, provider); 
    const decentDiscToken = new ethers.Contract(config[network.chainId].DecentDiscToken.address, tokenAbi, provider); 
    setDecentDisc(decentDisc); 

    // const signer2 = provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"); 
    const decentDisc2 = new ethers.Contract(config[network.chainId].DecentDisc.address, contractAbi, signer);

    const contractBalance = await decentDiscToken.balanceOf(config[network.chainId].DecentDisc.address); 
    console.log("Contract balance: ", contractBalance.toString()); 

    let tx = await decentDisc2.sendTokens(address, tokens(1), { gasLimit: 1000000 });
    await tx.wait(); 

    const addressBalance = await decentDiscToken.balanceOf(address); 
    console.log("Address balance: ", addressBalance.toString()); 

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
    loadBlockchainData(); 

    socket.on('connect', () => {
      console.log("Socket connected...")
      socket.emit('get messages')
    })

    socket.on('new message', (messages) => {
      console.log("new message..."); 
      setMessages(messages); 
    })

    socket.on('get messages', (messages) => {
      setMessages(messages); 
    })

    return () => {
      socket.off('connect')
      socket.off('new message')
      socket.off('get messages')
    }
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
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        /> 

        <Messages 
          handleToggleDarkMode={handleToggleDarkMode}
          account={account}
          messages={messages} 
          currentChannel={currentChannel}
        /> 
      </main>

    </div>
  )
}

export default App
