import Logo from "assets/svgs/logo";
import CustomButton from "components/CustomButton";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { switchNetwork } from "utils/ConnectWallet";
import Web3 from "web3";

function Login() {
  const navigate = useNavigate();
  let address = localStorage.getItem("account");

  useEffect(() => {
    if (address) {
      navigate("/home");
    }
  }, [address, navigate]);

  const wallerConnectModal = useCallback(async () => {
    if ((window as any)?.ethereum) {
      await (window as any)?.ethereum.request({
        method: "eth_requestAccounts",
      });
      const newWeb3 = new Web3((window as any)?.ethereum);

      const chainId = await newWeb3.eth.getChainId();

      if (Number(chainId) !== 97) {
        await switchNetwork(97);
      }
      const account = await newWeb3.eth.getAccounts();
      const finalChainID = await newWeb3.eth.getChainId();
      localStorage.setItem("account", account[0]);
      localStorage.setItem("chainId", String(finalChainID));

      console.log(finalChainID, "xhainid");
      return true;
    }
    return false;
  }, []);

  async function isConnected() {
    const accounts = await (window as any)?.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts.length) {
      console.log(`You're connected to: ${accounts[0]}`);
      return true;
    } else {
      console.log("Metamask is not connected");
      return false;
    }
  }

  const connectToWallet = useCallback(async () => {
    try {
      let walletConnected = await isConnected();

      if (!walletConnected) {
        if ((window as any)?.ethereum === undefined) {
          window
            .open(
              "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
              "_blank"
            )
            .focus();
        } else if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        ) {
          // open the deeplink page
          window.open("https://metamask.github.io/metamask-deeplinks/#");
        } else {
          await wallerConnectModal();
        }
      }
    } catch (error) {
      console.log(error, "wallet connect errors");
    }
  }, [wallerConnectModal]);
  return (
    <div className="root">
      <div className="d-flex flex-column justify-content-center align-items-center w-100 b-container">
        <div className="d-flex  cardBox">
          <div className="d-flex w-100 justify-content-center align-items-center">
            <Logo />
          </div>
          <CustomButton
            onClick={connectToWallet}
            variant="primary"
            type="submit"
            text={
              Number(localStorage.getItem("chainId")) === 97
                ? "User Logged In"
                : "Log in with MetaMask"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
