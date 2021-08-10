import 'regenerator-runtime/runtime';
import { useState, ReactElement, useEffect } from 'react';
import Form from './components/LockForm';
import Welcome from './components/Welcome';
import Upload from "./components/UploadForm";
import { providers, Signer } from "ethers"
import { Status, CoreAPI, Request } from "@textile/eth-storage"

interface Props {
  network: providers.Network
  api: CoreAPI
  wallet: Signer
  address: string
}

const App = ({ network, wallet, api, address }: Props): ReactElement => {
  const [uploads, setUploads] = useState<Array<Request>>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deposit, setDeposit] = useState<boolean>(false);
  const [netIdent, setIdent] = useState<string>("");
  const [netToken, setToken] = useState<string>("");
  const [conn, setConn] = useState<string>("");

  useEffect(() => {
    if (wallet) {
      api.hasDeposit().then(setDeposit)
    }
    if (network && network.name) {
      switch(network.name) {
        case "matic":
          setIdent("Polygon")
          setToken("MATIC")
          setConn("Polygon Mainnet")
          break;
        case "maticmum":
          setIdent("Polygon")
          setToken("MATIC")
          setConn("Polygon Mumbai")
          break;
        case "rinkeby":
          setIdent("Ethereum")
          setToken("Ξ")
          setConn("Ethereum Rinkeby")
          break;
        default:
          setIdent("")
          setToken("")
      }
    }
  }, [wallet, api, network])

  const onUpload = (file: File) => {
    setUploading(true)
    api.store(file)
      .then((request) => {
        setUploads([...uploads, request])
        setUploading(false)
        alert(`IPFS CID:\n${request.cid["/"]}`)
      })
      .catch((err: Error) => {
        setUploading(false)
        alert(err.message)
      });
  }

  const onStatus = (id: string) => {
    if (id) {
      api.status(id)
        .then(({ request }) => {
          alert(`Filecoin deal status: "${Status[request.status_code]}"!`)
        })
        .catch((err: Error) => alert(err.message));
    } else {
      console.warn("no 'active' file, upload a file first")
    }
  }

  const onSubmit = () => {
    api.addDeposit()
      .then(() => setDeposit(true))
      .catch((err: Error) => alert(err.message));
  };

  return (
    <main>
      <header>
        <h1>Textile {`${netIdent}`} Storage Demo</h1>
      </header>
      <p>
        {deposit ? `You got ${netToken} in here!` : `Deposit some funds, ${address}!`}
      </p>
      {address
        ? (<div>
          <Form onSubmit={onSubmit} />
          {deposit ? <Upload onSubmit={onUpload} inProgress={uploading} /> : null}
          <button type="button" name="release" onClick={(e) => {
            e.preventDefault();
            api.releaseDeposit()
              .then(() => {
                alert("if your session is over, your funds should be returned");
                // Auto-refresh the page
                window.location.reload();
              })
              .catch((err: Error) => alert(err.message));
          }}>Release
          </button>
          <br />
          {uploads && <h2>Your uploads</h2>}
          {uploads.map((u: Request) => {
            return <p>
              {u.cid["/"]}
              <br />
              <button type="button" name="copy" onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(u.cid["/"])
              }}>
                Copy CID
              </button>
              <button type="button" name="status" onClick={(e) => {
                e.preventDefault();
                onStatus(u.id);
              }}>
                Status
              </button>
              <br />
            </p>
          })}
          <br/>
          <p>
            <i>
              {`You are connected on ${conn}. Try this demo on Ethereum Rinkeby, Polygon Mumbai, or Polygon Mainnet.`}
            </i>
          </p>
        </div>
        ) : <Welcome />
      }
    </main>
  );
};

export default App;
