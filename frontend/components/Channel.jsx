import React from 'react'
import './styles/Channel.css'

const Channel = ({provider, account, channels, decentDisc, currentChannel, setCurrentChannel, gaslessContractCall, setLoading, setLoadingStatement, setError, setSuccess}) => {

  const channelHandler = async (channel) => {
    const joinedChannel = await decentDisc.joinedChannel(channel.id, account); 
    
    if(joinedChannel){
      console.log("Joined!")
      setCurrentChannel(channel)
    } else {
      setLoading(true)
      setLoadingStatement("Mnting NFT for joining channel...");
      console.log("Mnting NFT for joining channel..."); 
      // const signer = await provider.getSigner(); 
      try {
        const tx = await gaslessContractCall.mint(channel.id, account, {value: channel.cost});
        await tx.wait();
        setCurrentChannel(channel); 
        setTimeout( () => {
          setSuccess(true)
        }, 3000)
        setLoading(false); 
      } catch (error) {
        console.error(error); 
        setTimeout(() => {
          setError(true)
        }, 3000)
        setLoading(false)
      }
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
               className={currentChannel && currentChannel.id.toString() === channel.id.toString() ? "active" : ""}
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