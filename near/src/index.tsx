/// <reference lib="dom" />

import App from "./App";
import ReactDOM from "react-dom";
import getConfig from "./config.js";
import { connect, keyStores, WalletConnection } from "near-api-js";
import { init, requestSignIn } from "@textile/near-storage";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";

// Seems like a strange hack
const ENV = (process.env as unknown) as Record<string, string>;

async function initConnection() {
  const nearConfig = getConfig((ENV.NODE_ENV as any) || "testnet");

  // Initializing connection to the NEAR TestNet
  const near = await connect({
    deps: {
      keyStore: new keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  });

  // Needed to access wallet
  const wallet = new WalletConnection(near, null);

  await requestSignIn(wallet, { contractId: "storage-bridge-validator.near" });

  const api = await init(wallet.account(), {
    provider: "storage-bridge-validator.near",
    registry: "storage-bridge-registry.near"
  });

  return { api, wallet };
}

initConnection().then(({ api, wallet }) => {
  ReactDOM.render(
    <App api={api as any} wallet={wallet} />,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
