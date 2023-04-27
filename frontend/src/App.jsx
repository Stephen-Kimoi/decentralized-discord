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
import { WagmiConfig, createClient, configureChains, mainnet} from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import WagmiWallet from '../components/WagmiWallet';

import { socialLogin, socialLogout, getUser } from "../src/paper.js";
import { UserStatus } from "@paperxyz/embedded-wallet-service-sdk";

const socket = io('http://localhost:3030'); 

// const PRIVATE_KEY = process.env.LOCALNETWORK_PRIVATE_KEY; 
const PRIVATE_KEY = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat node wallet address **DO NOT SEND FUNDS!
const rpcProvider = "http://localhost:8545"; 

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [account, setAccount] = useState(); 
  const {walletConnected, setWalletConnected} = useState(false); 
  const [normalProvider, setProvider] = useState(); 
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // WAGMI WALLET CONNECTION 
  const { chains, provider , webSocketProvider } = configureChains(
    [polygonMumbai],
    [alchemyProvider({ apiKey: "https://polygon-mumbai.g.alchemy.com/v2/69ry0asPLc51jW8BjQR0YcAK7L7Rg5TZ" }), publicProvider()],
  )

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'Decentralized Discord',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: 'Decentralized Discord',
        },
      }),
    ],
    provider,
    webSocketProvider,
  })

  // PAPER WALLET CONNECTION 
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
        setPaperWallet(true); 
      })
    } catch (error) {
      console.error(error);
    }
  }
  // END OF PAPER WALLET CONNECTION


  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
  }

  const loadBlockchainData = async () => {
    let decentDiscProvider; 
    let allChannels;

    if (currentUser !== undefined) {

      const signer = await currentUser.wallet.getEthersJsSigner({
        rpcEndpoint: "https://polygon-mumbai.g.alchemy.com/v2/69ry0asPLc51jW8BjQR0YcAK7L7Rg5TZ", // REMOVE THIS
      });

      decentDiscProvider = new ethers.Contract(config[31337].DecentDisc.address, contractAbi, signer); 
      setDecentDiscProvider(decentDiscProvider); 

      allChannels = await decentDiscProvider.channelNumbers(); 

      console.log(allChannels.toString());
    } else {

      const provider = new ethers.providers.Web3Provider(window.ethereum); 
      setProvider(provider); 
      
      const network = await provider.getNetwork(); 
      const signer = await provider.getSigner(); 
      
      decentDiscProvider = new ethers.Contract(config[31337].DecentDisc.address, contractAbi, provider);  
      // setDecentDiscProvider(decentDiscProvider); 
      
      // REMOVE THIS CODE
      const decentDiscToken = new ethers.Contract(config[31337].DecentDiscToken.address, tokenAbi, provider);
      setDecentDiscToken(decentDiscToken); 
      const decentDiscSigner = new ethers.Contract(config[31337].DecentDisc.address, contractAbi, signer);
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

  const sendTokens = async () => {
    try {
      const tokens = (n) => {
        return ethers.utils.parseUnits(n.toString(), "ether")
      } 

      const network = await normalProvider.getNetwork(); 

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

  const checkAccountPoints = async () => {
    // ERROR IN FETCHING CONFIG FROM API 
    // fetch('/api/config')
    //   .then(response => response.json())
    //   .then(data => { setConfig(data); console.log('Data from fetch: ', data)} )

    try {
      newAccountPoints.forEach((account) => {

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
          handleSignUpWithEmail={connectWithPaperWallet}
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

        <button onClick={handleOpen}>Open Wallet Provider Modal</button>

      </div>
    </WagmiConfig>
  )
}

export default App
