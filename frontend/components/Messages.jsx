import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import './styles/Messages.css'

const socket = io('http://localhost:3030'); 

const Messages = ({account, messages, currentChannel, accountsWithMorePoints, accountsSentMessages, newAccountPoints, setNewAccountPoints, channelCreators, setChannelCreators}) => {
  const [message, setMessage] = useState(''); 
  // const [s]
  const messageEndRef = useRef(); 
   
  const addPoint = () => { 
    // console.log(123343); 
    let updatedAccountPoints
    const index = newAccountPoints.findIndex((item) => item.account === account)
    // console.log(`Index of ${account} is: `, index); 
    if (index !== -1){
      // console.log(`Points for ${account} is: `, newAccountPoints[index].points);
      const updatedAccount = {
        ...newAccountPoints[index], 
        points: newAccountPoints[index].points + 1
      }; 
      // console.log(`Points for ${account} is ${updatedAccount.points}`)
      // console.log('Account points: ', [...newAccountPoints])
      updatedAccountPoints = [...newAccountPoints]; 
      updatedAccountPoints[index] = updatedAccount; 
      // console.log("UPDATED ACCOUNTS POINTS: ", updatedAccountPoints); 
      setNewAccountPoints(updatedAccountPoints); 
    }

    const checkAccountPoints = () => {
      console.log("UPDATED ACCOUNTS: ", updatedAccountPoints)
      const index = updatedAccountPoints.findIndex((item) => item.account === account); 
      let result;      

      if(index !== -1){
        const points = newAccountPoints[index].points; 
        // console.log(`Points for ${account} are ${points}`); 
        if (points > 3){
          // console.log("TRUE!")
          result = true 
        } else {
          // console.log("FALSE!")
          result = false 
        }
      }

      return result; 
    }

    const result = checkAccountPoints();
    return result;
  }

  const addChannelCreator = (account) => {
    let updatedChannelCreators; 
    if(!channelCreators.find((creator) => creator === account)){
      // console.log(`${account} is not amoung channel creators`)
      updatedChannelCreators = [...channelCreators, account]
      // console.log("Updated channel creators: ", updatedChannelCreators); 
      setChannelCreators(updatedChannelCreators)

      const channelCreator = {
        account: account
      }; 

      socket.emit('new channel creator', channelCreator); 

    } else {
      // console.log(`${account} is among the channel creators`)
      updatedChannelCreators = channelCreators; 
    }
    
    // console.log("Updated channel creators: ", updatedChannelCreators); 
    return updatedChannelCreators; 
  }

  const sendMessage = async (e) => {
    e.preventDefault(); 
    // const updatedChannelCreators; 

    const messageObj = {
      channel: currentChannel.id.toString(), 
      account: account, 
      text: message
    }

    if (message !== ""){
      socket.emit('new message', messageObj);  
      const result = addPoint();
      // console.log(`Result for ${account} is ${result}`)
      
      // console.log("Channel creators: ", channelCreators); 
      if (result) {
        const updatedChannelCreators = addChannelCreator(account); 
        console.log('UPDATED CHANNEL CREATORS: ', updatedChannelCreators);
      } 

    }
    setMessage(""); 

    console.log("Sending message: ", message); 
  }

  const scrollHandler = () => {
    setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }


  useEffect(() => {
    scrollHandler(); 
    // checkAccountPoints(); 
  }, [])

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
        { currentChannel && account ? (
          <input 
            type='text' 
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${currentChannel.name}`}
          ></input>
        ) : (
          <input type='text' value="" placeholder={`Connect wallet & Join the channel`} disabled/> 
        )}
         <button type='submit'>
           <img src="./send.svg" alt="send message" />
         </button>
      </form>
      
    </div>
  )
}

export default Messages