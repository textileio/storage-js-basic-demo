import React, { ReactElement } from "react";

interface Props {
  onSubmit: () => void;
}

export default function DepositForm({ onSubmit }: Props): ReactElement {
  return (
    <form>
      <button
        type="button"
        name="deposit"
        onClick={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        Deposit
      </button>
    </form>
  );
}
