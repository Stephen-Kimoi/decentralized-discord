import React, { useState } from 'react';
import Modal from 'react-modal';

const WalletProviderModal = ({ isOpen, setIsOpen, handleOpen, handleClose}) => {

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={handleClose} style={modalStyles}>
        <h2>Choose the wallet provider you'd like to use</h2>
        <button style={yellowButtonStyle}>Metamask</button>
        <button style={blueButtonStyle}>Coinbase</button>
        <button style={grayButtonStyle}>Have no wallet. Click here to sign up with email</button>
      </Modal>
    </>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '10px',
  },
};

const yellowButtonStyle = {
  backgroundColor: 'yellow',
  color: 'black',
  padding: '10px',
  margin: '5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const blueButtonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px',
  margin: '5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const grayButtonStyle = {
  backgroundColor: 'gray',
  color: 'white',
  padding: '10px',
  margin: '5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default WalletProviderModal;
