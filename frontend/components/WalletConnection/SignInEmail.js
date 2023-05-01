import { socialLogin, socialLogout, getUser } from "../paper.js";
import { UserStatus } from "@paperxyz/embedded-wallet-service-sdk";

export async function connectWithPaperWallet() {
    let connectedUserObj; 
    try {
      // let walletAddress; 
      await socialLogin().then((user) => {
        // console.log("Users wallet address is: ", user.walletAddress); 
        if (UserStatus.LOGGED_IN_WALLET_INITIALIZED === user.status) {
            const connectedUser = setUser();
            connectedUserObj = connectedUser; 
          // console.log("User obj: ", connectedUserObj); 
        }
      }); 
    } catch (e) {
      console.log(e);
    }
    return connectedUserObj;
  }

  async function logout() {
    try {
      await socialLogout().then(() => {
        setUser();
      });
    } catch (error) {
      console.log(error);
    };
  }

  async function setUser() {
    let connectedUser; 
    // let walletAddress; 
    try {
      await getUser().then((user) => {
        if (user.status === UserStatus.LOGGED_OUT) {
          console.log(`User not logged in!`)
          toggleConnect(false);
          updateUser(null);
          updateAddress('0x');
          return;
        }
        console.log(`User ${user.walletAddress} logged in!`)
        // updateUser(user); 
        // setAccount(user.walletAddress); 
        // setWalletConnected(true); // return boolean
        // toggleConnect(true); // return boolean 
        // setPaperWallet(true); // return boolean

        connectedUser = user; 
        // walletAddress = user.walletAddress; 
      })
    } catch (error) {
      console.error(error);
    }
    return connectedUser;  
  }