import React from 'react'
import './styles/Channel.css'

const Channel = ({provider, account, channels, decentDisc}) => {

  const channelHandler = async (channel) => {
    const joinedChannel = await decentDisc.joinedChannel(channel.id, account); 
    
    if(joinedChannel){
      console.log("Joined!")
    } else {
      console.log("Mnting NFT for joining channel..."); 
      const signer = await provider.getSigner(); 
      const tx = await decentDisc.connect(signer).mint(channel.id, {value: channel.cost});
      await tx.wait();
    }
  }

  return (
    <div className='channels'>

      <div className='channels_text'>
         <h3>Text Channels</h3>

         <ul>
           {channels.map( (channel, index) => (
             <li 
               key={index}
               onClick={ () => channelHandler(channel) }
               >
                {channel.name}
               </li>
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