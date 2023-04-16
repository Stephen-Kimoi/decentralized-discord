import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Server from '../components/Server';
import Channel from '../components/Channel';
import Messages from '../components/Messages';
import { abi as contractAbi } from '../abi/DecentDisc.json'; 
import { abi as tokenAbi } from "../abi/DecentDiscToken.json"; 
import config from '../config.json';
import { io } from 'socket.io-client';
// require("dotenv").config();

const socket = io('http://localhost:3030'); 

// const PRIVATE_KEY = process.env.LOCALNETWORK_PRIVATE_KEY; 
const PRIVATE_KEY = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat node wallet address **DO NOT SEND FUNDS!
const rpcProvider = "http://localhost:8545"; 


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [account, setAccount] = useState(); 
  const {walletConnected, setWalletConnected} = useState(false); 
  const [provider, setProvider] = useState(); 
  const [decentDiscProvider, setDecentDiscProvider] = useState(); 
  const [decentDiscSigner, setDecentDiscSigner] = useState(); 
  const [decentDiscToken, setDecentDiscToken] = useState(); 
  const [channels, setChannels] = useState([]); 
  const [currentChannel, setCurrentChannel] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [accountPoints, setAccountPoints] = useState([]); 
  const [accountsWithMorePoints, setAccountsWithMorePoints] = useState([]); 
  const [accountsSentMessages, setAccountsSentMessages] = useState(); 
  // const [config, setConfig] = useState(null); 


  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); 
    setProvider(provider); 
    
    const network = await provider.getNetwork(); 
    const signer = await provider.getSigner(); 
    
    const decentDiscProvider = new ethers.Contract(config[network.chainId].DecentDisc.address, contractAbi, provider);  
    setDecentDiscProvider(decentDiscProvider); 

    const decentDiscToken = new ethers.Contract(config[network.chainId].DecentDiscToken.address, tokenAbi, provider);
    setDecentDiscToken(decentDiscToken); 
    const decentDiscSigner = new ethers.Contract(config[network.chainId].DecentDisc.address, contractAbi, signer);
    setDecentDiscSigner(decentDiscSigner); 

    const allChannels = await decentDiscProvider.channelNo(); 
    const channels = []; 
    // console.log("Total channels: ", allChannels.toString()); 

    for (let i = 0; i <= allChannels; i++) {
      const channel = await decentDiscProvider.getChannel(i); 
      channels.push(channel); 
    }

    setChannels(channels)

    window.ethereum.on('accountsChanged', function () {
      window.location.reload()
    })

  } 

  const sendTokens = async () => {
    try {
      const tokens = (n) => {
        return ethers.utils.parseUnits(n.toString(), "ether")
      } 

      const network = await provider.getNetwork(); 

      const provider2 = new ethers.providers.JsonRpcProvider(rpcProvider);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider2);
      
      const decentDiscToken = new ethers.Contract(config[network.chainId].DecentDiscToken.address, tokenAbi, wallet);

      const decentDisc = new ethers.Contract(config[network.chainId].DecentDisc.address, contractAbi, wallet);

      const contractBalance = await decentDiscToken.balanceOf(decentDisc.address); 
      console.log("Contract balance: ", contractBalance.toString()); 

      const addressBalanceBefore = await decentDiscToken.balanceOf(account);
      console.log(`Address balance of ${account} before sending tokens is ${addressBalanceBefore}`);

      let tx = await decentDisc.sendTokens(account, tokens(1), { gasLimit: 1000000 });
      await tx.wait(); 

      const addressBalance = await decentDiscToken.balanceOf(account); 
      console.log(`Address balance of ${account} after: `, addressBalance.toString()); 

    } catch (error) {
      console.error(error)
    }
  }

  const updateAccounts = (messages) => {
    const updatedAccounts = accountPoints.map((account) => {
      console.log("Account is: ", account)
      const accountMessages = messages.filter((message) => {
        return message.account === account.account; 
      })
      const points = accountMessages.length; 
      return {...account, points}; 
    })
    // console.log("UPDATED ACCOUNTS: ", updatedAccounts); 
    setAccountPoints(updatedAccounts); 
  }

  const checkAccountPoints = async () => {
    // ERROR IN FETCHING CONFIG FROM API 
    // fetch('/api/config')
    //   .then(response => response.json())
    //   .then(data => { setConfig(data); console.log('Data from fetch: ', data)} )

    try {
      accountPoints.forEach((account) => {

        if (account.points > 3){
          console.log('Account with more points: ', account.account)
          setAccountsWithMorePoints(prev => [...prev, account.account]); // Over here 
          // sendTokens(account.account)
        } else {
          console.log(`${account.account} please contribute to the channel to get more points`)
        }

      });

      // console.log("Accounts that have sent messages: ", accountsSentMessages); 

    } catch (error) {
      console.error(error); 
    }
  }

  useEffect( () => {
    loadBlockchainData(); 
    checkAccountPoints(); 

    socket.on('connect', () => {
      console.log("Socket connected...")
      socket.emit('get messages')
      socket.emit('get points')
    })

    socket.on('get points', (accounts) => {
      setAccountPoints(accounts)
    })

    socket.on('new message', (messages) => {
      console.log("new message..."); 
      setMessages(messages); 
    })

    socket.on('get messages', (messages) => {
      updateAccounts(messages); 
      setMessages(messages); 
      let accounts = []; 
      accounts = messages.map(message => message.account); 
      // console.log("Accounts socket on: ", accounts)
      setAccountsSentMessages(accounts);
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
          decentDisc={decentDiscProvider}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        /> 

        <Messages 
          handleToggleDarkMode={handleToggleDarkMode}
          account={account}
          messages={messages} 
          currentChannel={currentChannel}
          accountsWithMorePoints={accountsWithMorePoints}
          accountsSentMessages={accountsSentMessages}
        /> 
      </main>

      <button onClick={sendTokens}>
        Send tokens
      </button>

    </div>
  )
}

export default App
