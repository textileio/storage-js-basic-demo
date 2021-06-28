/// <reference lib="dom" />

import App from "./App"
import ReactDOM from 'react-dom';
import getConfig from './config.js';
import { connect, keyStores, WalletConnection } from 'near-api-js';
import { init } from "@textile/near-storage"
import reportWebVitals from './reportWebVitals';
import "./index.scss"

// Seems like a strange hack
const ENV = process.env as unknown as Record<string, string>

declare global {
  interface Window {
    nearInitPromise: Promise<void>
  }
}

// Initializing contract
async function initConnection() {
  const nearConfig = getConfig(ENV.NODE_ENV as any || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await connect({
    deps: {
      keyStore: new keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  });

  // Needed to access wallet
  const walletConnection = new WalletConnection(near, null);

  const api = await init(walletConnection, { contractName: 'filecoin-bridge-edge' })

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount
    };
  }

  return { currentUser, api }
}

window.nearInitPromise = initConnection()
  .then(({ api, currentUser }) => {
    ReactDOM.render(
      <App
        api={api}
        currentUser={currentUser}
      />,
      document.getElementById('root')
    );
  });


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
