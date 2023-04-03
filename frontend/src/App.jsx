import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

function App() {
  const [account, setAccount] = useState(); 
  const {walletConnected, setWalletConnected} = useState(false); 

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
      <Navbar account={account} walletConnected={walletConnected} setAccount={setAccount} /> 
    </div>
  )
}

export default App
