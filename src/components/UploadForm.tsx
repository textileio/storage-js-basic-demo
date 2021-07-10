import React, { useState, ReactElement } from 'react';

interface Props {
  inProgress: boolean
  onSubmit: (file: File) => void;
}

export default function UploadForm({ inProgress, onSubmit }: Props): ReactElement {
  const [file, setFile] = useState<File>();
  return (
    <form>
      <fieldset id="fieldset">
        <input type="file" name="file" onChange={(event) => {
          if (event.target.files)
            setFile(event.target.files[0]);
        }}></input>
        <button type="button" name="upload" className={inProgress===true ? "loading" : ""} onClick={(e) => {
          e.preventDefault();
          if (file) onSubmit(file);
          setFile(undefined);
        }}>
          Upload
        </button>
      </fieldset>
    </form>
  );
}