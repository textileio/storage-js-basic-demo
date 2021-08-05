/// <reference lib="dom" />

import App from "./App"
import ReactDOM from "react-dom";
import getConfig from "./config.js";
import { connect, keyStores, WalletConnection } from 'near-api-js';
import { providers } from "ethers";
import { init as initNear } from "@textile/near-storage";
import { init as initEth } from "@textile/eth-storage";
import reportWebVitals from "./reportWebVitals"
import "./index.scss";

// Seems like a strange hack
const ENV = process.env as unknown as Record<string, string>;

declare global {
  interface Window {
    ethereum: providers.ExternalProvider
  }
}

async function initEthConnection() {
  await (window.ethereum as any).enable();
  const provider = new providers.Web3Provider(window.ethereum);
  const wallet = provider.getSigner();
  console.log(wallet)

  const api = await initEth(wallet);

  return { api, wallet }
}

async function initNearConnection() {
  const nearConfig = getConfig(ENV.NODE_ENV as any || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await connect({
    deps: {
      keyStore: new keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  });

  // Needed to access wallet
  const wallet = new WalletConnection(near, null);

  const api = await initNear(wallet.account(), { contractId: 'filecoin-bridge.testnet' });

  return { api, wallet }
}

initEthConnection()
  .then(({ api, wallet }) => {
    ReactDOM.render(
      <App
        api={api as any}
        wallet={wallet}
      />,
      document.getElementById('root')
    );
  });


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
