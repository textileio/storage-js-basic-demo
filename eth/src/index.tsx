/// <reference lib="dom" />

import App from "./App"
import ReactDOM from "react-dom";
import { providers } from "ethers";
import { init } from "@textile/eth-storage";
import reportWebVitals from "./reportWebVitals"
import "./index.scss";

declare global {
  interface Window {
    ethereum: providers.ExternalProvider
  }
}

async function initEthConnection() {
  if (!window.ethereum) {
    throw new Error("No web3 provider found. Please install metamask browser extension.")
  }
  await (window.ethereum as any).enable();
  const provider = new providers.Web3Provider(window.ethereum);
  const wallet = provider.getSigner();

  const api = await init(wallet);
  const address = await wallet.getAddress();

  return { api, wallet, address }
}

initEthConnection()
  .then((props) => {
    ReactDOM.render(
      <App
        {...props}
      />,
      document.getElementById('root')
    );
  })
  .catch((err) => {
    alert(err.message)
  });


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
