import React, { ReactElement } from "react";

export default function Welcome(): ReactElement {
  return (
    <div>
      <p>
        This app demonstrates the client-side usage of{" "}
        <a href="https://near.storage" target="_blank" rel="noreferrer">
          the NEAR to Filecoin bridge
        </a>
        , allowing{" "}
        <a href="https://near.org" target="_blank" rel="noreferrer">
          NEAR
        </a>{" "}
        users to store data on the{" "}
        <a href="https://filecoin.io" target="_blank" rel="noreferrer">
          Filecoin
        </a>{" "}
        network.
      </p>
      <p>
        This is version 0 of the demo app. You can deposit and release funds,
        query for the status of a "file" or deal, and more. This is a beta
        release demo, do not store personal, encrypted, or illegal data. Data
        will not be available permanently on either Filecoin or IPFS. See the{" "}
        <a href="https://near.storage/terms" target="_blank" rel="noreferrer">
          terms of service
        </a>{" "}
        before using the demo.
      </p>
      <p>Go ahead and sign in to try it out!</p>
    </div>
  );
}
