import React from 'react';
import ReactDOM from 'react-dom';
import { PuffLoader } from 'react-spinners';

function Spinner() {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
      <PuffLoader color="#36d7b7" />
    </div>,
    document.body // render directly into the body
  );
}

export default Spinner;
