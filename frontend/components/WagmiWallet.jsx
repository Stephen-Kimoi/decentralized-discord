import React from 'react'
import { useConnect } from 'wagmi'
import Modal from 'react-modal';

const WagmiWallet = ({ isOpen, setIsOpen, handleOpen, handleClose, handleSignUpWithEmail}) => {
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  return (
    // <div>
    //     {connectors.map((connector) => (
    //     <button
    //       disabled={!connector.ready}
    //       key={connector.id}
    //       onClick={() => connect({ connector })}
    //     >
    //       {connector.name}
    //       {!connector.ready && ' (unsupported)'}
    //       {isLoading &&
    //         connector.id === pendingConnector?.id &&
    //         ' (connecting)'}
    //     </button>
    //   ))}
    //   {error && <div>{error.message}</div>}
    // </div>
    <Modal isOpen={isOpen} onRequestClose={handleClose} style={modalStyles}>
        <h2 style={{ textAlign: 'center' }} >Choose the wallet provider you'd like to use</h2>
        <div>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              disabled={!connector.ready}
              onClick={() => connect({ connector })}
              style={buttonStyle(connector)}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </button>
          ))}
          <button
            onClick={handleSignUpWithEmail}
            style={{ backgroundColor: '', color: 'black', cursor: 'pointer', margin: '0 auto' }}
          >
            Have no wallet. Click here to sign up with email
          </button>
        </div>
        {error && <div>{error.message}</div>}
      </Modal>
  )
}

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
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
  },
};

const buttonStyle = (connector) => ({
  backgroundColor: connector.color,
  color: 'black',
  padding: '10px',
  margin: '5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  opacity: connector.ready ? 1 : 0.5,
});

export default WagmiWallet