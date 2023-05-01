import { WagmiConfig, createClient, configureChains, mainnet,  useAccount, useDisconnect} from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const { chains, provider , webSocketProvider } = configureChains(
    [polygonMumbai],
    [alchemyProvider({ apiKey: "https://polygon-mumbai.g.alchemy.com/v2/69ry0asPLc51jW8BjQR0YcAK7L7Rg5TZ" }), publicProvider()],
  )

export const client = createClient({
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