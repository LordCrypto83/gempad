import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import 'antd/dist/antd.css';
import './assets/styles/styles.scss';
import Layout from './layouts';
import Presales from './pages/presales';
import SpecialSales from './pages/special-sales';
import Launchpad from './pages/launchpad';
import Locks from './pages/locks';
import TokenLockDetail from './pages/locks/TokenLockDetail';
import LiquidityLockDetail from './pages/locks/LiquidityLockDetail';
import Tools from './pages/tools';
import bsc from "./assets/img/chains/bsc.png";

import {
  getDefaultWallets,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import "@rainbow-me/rainbowkit/styles.css";
import PresaleDetails from './pages/presales/PresaleDetails';


const client = new ApolloClient({
  uri: "https://127.0.0.1/graphiql",
  cache: new InMemoryCache(),
});

const bscChain = {
  id: 535037,
  name: 'BeanEco SmartChain',
  network: 'BeanEco_SmartChain',
  iconUrl: bsc,
  iconBackground: 'none',
  nativeCurrency: {
    decimals: 18,
    name: 'BESC',
    symbol: 'BESC',
  },
  rpcUrls: {
    default: 'https://mainnet-rpc.bescscan.io',
  },
  blockExplorers: {
    default: { name: 'BESCscan', url: 'https://bescscan.io' },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [
    bscChain,
    chain.mainnet
  ],
  [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) })]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  const [page, setPage] = useState(0);

  return (
    <ApolloProvider client={client}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} autoConnect>
          <Layout page={page}>
            <Routes>
              <Route index element={<Link to="/presales" />} />
              <Route path="presales" element={<Link to="/presales/explore" />} />
              <Route path="presales/:tab" element={<Presales setPage={setPage} />} />
              <Route path="presale/:saleAddress" element={<PresaleDetails setPage={setPage} />} />
              <Route path="special_sales" element={<Link to="/special_sales/explore" />} />
              <Route path="special_sales/:tab" element={<SpecialSales setPage={setPage} />} />
              <Route path="launchpad" element={<Link to="/launchpad/create_presale" />} />
              <Route path="launchpad/:tab" element={<Launchpad setPage={setPage} />} />
              <Route path="locks" element={<Link to="/locks/create_lock" />} />
              <Route path="locks/:tab" element={<Locks setPage={setPage} />} />
              <Route path="locks/token_lock/:tokenAddress" element={<TokenLockDetail setPage={setPage} />} />
              <Route path="locks/liquidity_lock/:tokenAddress" element={<LiquidityLockDetail setPage={setPage} />} />
              <Route path="tools" element={<Link to="/tools/airdrop" />} />
              <Route path="tools/:tab" element={<Tools setPage={setPage} />} />
            </Routes>
          </Layout>
          <ToastContainer autoClose={2000} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>


  );
}

export default App;
