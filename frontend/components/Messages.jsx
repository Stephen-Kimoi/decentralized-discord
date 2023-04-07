import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import './styles/Messages.css'

const socket = io('http://localhost:3030'); 

const Messages = ({account, messages, currentChannel}) => {

  const messageEndRef = useRef(); 

  return (
    <div className='text'>

      <div className='messages'>
        { currentChannel && messages.filter(message => message.channel === currentChannel.id.toString()).map((message, index) => (
          <div className='message' key={index}>
            <img src="./person.svg" alt="person"/>
            <div className='message_content'>
              <h1>{message.account.slice(0, 6)} ... {message.account.slice(38, 42)}</h1>
              <p>
                {message.text}
              </p>
            </div>
          </div>
        ))}

        <div ref={messageEndRef}/>
      </div>

      <form onSubmit={sendMessage}>
         <input type='text'></input>

         <button type='submit'>
           <img src="./send.svg" alt="send message" />
         </button>
      </form>
      
    </div>
  )
}

export default Messages