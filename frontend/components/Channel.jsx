import React from 'react'
import './styles/Channel.css'

const Channel = ({provider, account, channels, decentDisc}) => {
  return (
    <div className='channels'>

      <div className='channels_text'>
         <h3>Text Channels</h3>

         <ul>
           {channels.map( (channel, index) => (
             <li key={index}>{channel.name}</li>
           ))}
         </ul>

      </div>

      <div className='channel_voice'>
         <h2>Voice channels</h2>

         <ul>
            <li>Channel 1</li>
            <li>Channel 2</li>
            <li>Channel 3</li>
         </ul>

      </div>
    </div>
  )
}

export default Channel