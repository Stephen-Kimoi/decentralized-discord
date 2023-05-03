import React from 'react';
import { MutatingDots } from  'react-loader-spinner'
import './Loading.css'; 

const LoadingModal = ({ loading, loadingStatement, error, success }) => {
  return (
    loading && (
      <div className="loading-modal">
        <div className='modal-container'>
         {
           !success && (
            <div className='modal-container'>
              <MutatingDots 
                height="100"
                width="100"
                color="black"
                secondaryColor= 'black'
                radius='12.5'
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              <p className='loading-statement'>{loadingStatement}</p>
            </div>
          )
         }
         {
          success && (
            <div>
              SUCCES!
            </div>
          )
         }
         {
          error && (
            <div>
              Sorry an error occured! Try again in a few
            </div>
          )
         }
        </div>
      </div>
    )
  );
};

export default LoadingModal;