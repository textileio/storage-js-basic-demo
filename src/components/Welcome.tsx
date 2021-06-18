import React, { ReactElement } from 'react';

export default function Welcome(): ReactElement {
  return (
    <div>
      <p>
          This app demonstrates the client-size usage of Textile's deposit
          mechanism for storing Filecoin data from the Near Blockchain.
      </p>
      <p>
          This is version 0 of the demo app. You can deposit and release funds,
          query for the status of a "file" or deal, and more.
      </p>
      <p>
          Go ahead and sign in to try it out!
      </p>
    </div>
  );
}
