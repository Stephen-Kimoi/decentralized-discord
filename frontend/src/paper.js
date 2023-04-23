import { PaperEmbeddedWalletSdk } from "@paperxyz/embedded-wallet-service-sdk";
import { UserStatus } from "@paperxyz/embedded-wallet-service-sdk";

export const sdk = new PaperEmbeddedWalletSdk({
    clientId: "dc873895-9d6f-435c-864a-4c067ef07270", // **remove this 
    chain: "Mumbai",
});


export const socialLogin = async () => {
    try {
      await sdk.auth.loginWithPaperModal();
      return sdk.getUser();
    } catch (e) {
      console.log(e);
    }
}

export const socialLogout = async () => {
    try {
      await sdk.auth.logout();
    } catch (e) {
      console.log(e);
    }
}

export const getUser = async () => {
    const user = await sdk.getUser();
    return user;
}

export const getSigner = async () => {
    let signer;
    const user = await getUser();
    if (user.status === UserStatus.LOGGED_OUT) {
      return;
    }
    try {
      signer = await getUser().then((user) => {
        return user.wallet.getEthersJsSigner();
      });
    } catch (e) {
      console.log(e);
    }
    return signer;
}

