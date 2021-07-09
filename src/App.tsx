import 'regenerator-runtime/runtime';
import { useState, ReactElement, useEffect } from 'react';
import Form from './components/LockForm';
import Welcome from './components/Welcome';
import Upload from "./components/UploadForm";
import { Status, API, Request, requestSignIn } from "@textile/near-storage"
import { WalletConnection } from 'near-api-js';

interface Props {
  api: API
  currentUser?: {
    accountId: string
  },
  walletConnection: WalletConnection
}

const App = ({ walletConnection, api, currentUser }: Props): ReactElement => {
  const [uploads, setUploads] = useState<Array<Request>>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deposit, setDeposit] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      api.hasDeposit().then(setDeposit)
    }
  }, [currentUser, api])

  const accountId = currentUser && currentUser.accountId

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

  const signIn = () => {
    requestSignIn(walletConnection, {});
  };

  const signOut = () => {
    walletConnection.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <h1>Textile Near Storage Demo</h1>
        {accountId
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      <p>
        {deposit ? "You got Ⓝ in here!" : `Deposit some funds, ${accountId}!`}
      </p>
      {accountId
        ? (<div>
          <Form onSubmit={onSubmit} />
          {deposit ? <Upload onSubmit={onUpload} inProgress={uploading} /> : null}
          <button type="button" name="release" onClick={(e) => {
            e.preventDefault();
            api.releaseDeposits()
              .then(() => {
                alert("check your wallet in case of released funds")
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
        </div>
        ) : <Welcome />
      }
    </main>
  );
};

export default App;
