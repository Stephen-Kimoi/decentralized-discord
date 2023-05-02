import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Server from '../components/Server';
import Channel from '../components/Channel';
import Messages from '../components/Messages';
import { abi as contractAbi } from '../abi/DecentDisc.json'; 
import { abi as tokenAbi } from "../abi/DecentDiscToken.json"; 
import constants from '../constants.json'
import config from '../config';
import { io } from 'socket.io-client';
import { WagmiConfig, createClient, configureChains, mainnet,  useAccount, useDisconnect} from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import WagmiWallet from '../components/WagmiWallet';
import { connectWithPaperWallet } from '../components/WalletConnection/SignInEmail';

import { client } from '../components/WalletConnection/WagmiWalletConnect';

// import {
//   useAccount,
//   useConnect,
//   useDisconnect,
//   useEnsAvatar,
//   useEnsName,
// } from 'wagmi'

const socket = io('http://localhost:3030'); 

const testnetAccountPrivateKey = config.privateKey
const alchemyRpcProvider = config.rpcProvider

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [account, setAccount] = useState(); 
  const {walletConnected, setWalletConnected} = useState(false); 
  const [normalProvider, setProvider] = useState(); 
  const [emailSigner, setEmailSigner] = useState(); 
  const [gaslessContractCall, setGaslessContractCall] = useState(); 
  const [decentDiscProvider, setDecentDiscProvider] = useState(); 
  const [decentDiscSigner, setDecentDiscSigner] = useState(); 
  const [decentDiscToken, setDecentDiscToken] = useState(); 
  const [channels, setChannels] = useState([]); 
  const [currentChannel, setCurrentChannel] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [accountPoints, setAccountPoints] = useState([]); 
  const [newAccountPoints, setNewAccountPoints] = useState([]);
  const [accountsWithMorePoints, setAccountsWithMorePoints] = useState([]); 
  const [accountsSentMessages, setAccountsSentMessages] = useState(); 
  const [channelCreators, setChannelCreators] = useState([]); 
  const [paperWallet, setPaperWallet] = useState(false); 
  const [currentUser, updateUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [connected, toggleConnect] = useState(false);
  const [signedUpWithEmail, setSignedUpWithEmail] = useState(false); 
  const [signedUpWithWagmi, setSignedUpWithWagmi] = useState(false); 

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const { address, connector, isConnected } = useAccount(); 
  
  // if(address){
  //   console.log("Address is: ", address)
  // } else {
  //   console.log("Address absent")
  // }


  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
  }

  const loadBlockchainData = async () => {
    let decentDiscProvider; 
    let allChannels;

    if (currentUser !== null) {
      const signer = await currentUser.wallet.getEthersJsSigner({
        rpcEndpoint: alchemyRpcProvider, // REMOVE THIS
      });

      setEmailSigner(signer); 

      decentDiscProvider = new ethers.Contract(constants[31337].DecentDisc.address, contractAbi, signer); 
      setDecentDiscProvider(decentDiscProvider); 

      allChannels = await decentDiscProvider.channelNumbers(); 

      console.log(allChannels.toString());

      // Set gasless transaction 
      const provider2 = new ethers.providers.JsonRpcProvider(alchemyRpcProvider);
      const wallet = new ethers.Wallet(testnetAccountPrivateKey, provider2);

      const decentDiscGasless = new ethers.Contract(constants[31337].DecentDisc.address, contractAbi, wallet);
      setGaslessContractCall(decentDiscGasless); 

    } else {
      console.log("COde is here lalalal!")
      const provider = new ethers.providers.Web3Provider(window.ethereum); 
      setProvider(provider); 
      
      const network = await provider.getNetwork(); 
      const signer = await provider.getSigner(); 
      
      decentDiscProvider = new ethers.Contract(constants[31337].DecentDisc.address, contractAbi, provider);  
      // setDecentDiscProvider(decentDiscProvider); 
      
      // Set gasless transaction 
      const provider2 = new ethers.providers.JsonRpcProvider(alchemyRpcProvider);
      const wallet = new ethers.Wallet(testnetAccountPrivateKey, provider2);

      const decentDiscGasless = new ethers.Contract(constants[31337].DecentDisc.address, contractAbi, wallet);
      setGaslessContractCall(decentDiscGasless); 
      
      // REMOVE THIS CODE
      const decentDiscToken = new ethers.Contract(constants[31337].DecentDiscToken.address, tokenAbi, provider);
      setDecentDiscToken(decentDiscToken); 
      const decentDiscSigner = new ethers.Contract(constants[31337].DecentDisc.address, contractAbi, signer);
      setDecentDiscSigner(decentDiscSigner); 

    }
     
    setDecentDiscProvider(decentDiscProvider); 

    allChannels = await decentDiscProvider.channelNumbers(); 
    const channels = []; 

    for (let i = 0; i <= allChannels; i++) {
      const channel = await decentDiscProvider.getChannel(i); 
      channels.push(channel); 
    }

    setChannels(channels)

    window.ethereum.on('accountsChanged', function () {
      window.location.reload()
    })

  } 

  // const sendTokens = async () => {
  //   try {
  //     const tokens = (n) => {
  //       return ethers.utils.parseUnits(n.toString(), "ether")
  //     } 

  //     const network = await normalProvider.getNetwork(); 

  //     const provider2 = new ethers.providers.JsonRpcProvider(rpcProvider);
  //     const wallet = new ethers.Wallet(PRIVATE_KEY, provider2);
      
  //     const decentDiscToken = new ethers.Contract(constants[network.chainId].DecentDiscToken.address, tokenAbi, wallet);

  //     const decentDisc = new ethers.Contract(config[network.chainId].DecentDisc.address, contractAbi, wallet);

  //     const contractBalance = await decentDiscToken.balanceOf(decentDisc.address); 
  //     console.log("Contract balance: ", contractBalance.toString()); 

  //     const addressBalanceBefore = await decentDiscToken.balanceOf(account);
  //     console.log(`Address balance of ${account} before sending tokens is ${addressBalanceBefore}`);

  //     let tx = await decentDisc.sendTokens(account, tokens(1), { gasLimit: 1000000 });
  //     await tx.wait(); 

  //     const addressBalance = await decentDiscToken.balanceOf(account); 
  //     console.log(`Address balance of ${account} after: `, addressBalance.toString()); 

  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const updateAccounts = (messages) => {
    const updatedAccounts = accountPoints.map((account) => {
      // console.log("Account is: ", account)
      const accountMessages = messages.filter((message) => {
        return message.account === account.account; 
      })
      const points = accountMessages.length; 
      return {...account, points}; 
    })
    // console.log("UPDATED ACCOUNTS: ", updatedAccounts); 
    setNewAccountPoints(updatedAccounts); 
  }

  // const checkAccountPoints = async () => {
  //   // ERROR IN FETCHING CONFIG FROM API 
  //   // fetch('/api/config')
  //   //   .then(response => response.json())
  //   //   .then(data => { setConfig(data); console.log('Data from fetch: ', data)} )

  //   try {
  //     newAccountPoints.forEach((account) => {

  //       if (account.points > 3){
  //         console.log('Account with more points: ', account.account)
  //         setAccountsWithMorePoints(prev => [...prev, account.account]); // Over here 
  //         // sendTokens(account.account)
  //       } else {
  //         console.log(`${account.account} please contribute to the channel to get more points`)
  //       }

  //     });

  //     // console.log("Accounts that have sent messages: ", accountsSentMessages); 

  //   } catch (error) {
  //     console.error(error); 
  //   }
  // }

  useEffect( () => {
    loadBlockchainData(); 
    // checkAccountPoints(); 

    socket.on('connect', () => {
      console.log("Socket connected...")
      socket.emit('get messages')
      socket.emit('get points')
      socket.emit('channel creators')
    })

    socket.on('channel creators', (channelCreators) => {
      setChannelCreators(channelCreators); 
      // console.log("NEW CHANNEL CREATORS: ", channelCreators); 
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
      socket.off('get points')
      socket.off('channel creators')
    }
  }, [account])

  return (
    <WagmiConfig client={client}>
      <div className="App">
        <WagmiWallet 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleOpen={handleOpen}
          handleClose={handleClose}
          // handleSignUpWithEmail={connectWithPaperWallet}
          setAccount={setAccount}
          setSignedUpWithEmail={setSignedUpWithEmail}
          setSignedUpWithWagmi={setSignedUpWithWagmi}
          setCurrentUser={updateUser}
        />
        <Navbar 
          account={account} 
          walletConnected={walletConnected} 
          setWalletConnected={setWalletConnected} 
          setAccount={setAccount} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          handleToggleDarkMode={handleToggleDarkMode}
          paperWallet={paperWallet}
          setPaperWallet={setPaperWallet}
          currentUser={currentUser} 
          updateUser={updateUser}
          handleOpen={handleOpen}
          isConnected={isConnected}
          address={address}
          client={client}
          WagmiConfig={WagmiConfig}
          signedUpWithWagmi={signedUpWithWagmi}
          signedUpWithEmail={signedUpWithEmail}
          setSignedUpWithEmail={setSignedUpWithEmail}
        /> 
        
        <main className={`${isDarkMode ? "dark" : " "}`}>
          <Server 
            handleToggleDarkMode={handleToggleDarkMode}
          /> 

          <Channel 
            handleToggleDarkMode={handleToggleDarkMode}
            provider={normalProvider}
            account={account}
            decentDisc={decentDiscProvider}
            channels={channels}
            currentChannel={currentChannel}
            setCurrentChannel={setCurrentChannel}
            emailSigner={emailSigner}
            gaslessContractCall={gaslessContractCall}
          /> 

          <Messages 
            handleToggleDarkMode={handleToggleDarkMode}
            account={account}
            messages={messages} 
            currentChannel={currentChannel}
            accountsWithMorePoints={accountsWithMorePoints}
            accountsSentMessages={accountsSentMessages}
            newAccountPoints={newAccountPoints}
            setNewAccountPoints={setNewAccountPoints}
            channelCreators={channelCreators}
            setChannelCreators={setChannelCreators}
          /> 
        </main>

        {/* <button onClick={sendTokens}>
          Send tokens
        </button> */}

        {/* <button onClick={disconnect}>Disconnect wallet</button> */}

      </div>
    </WagmiConfig>
  )
}

export default App
