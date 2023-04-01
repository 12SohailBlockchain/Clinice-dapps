import { NETWORK_LIST } from "constants/index";
import { useCallback } from "react";
import Web3 from "web3";

  export const switchNetwork = async (chainId) => {
    try {
      await (window as any)?.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(chainId) }],
      });
    } catch (err) {
      const networkObject = NETWORK_LIST?.[Number(chainId)];
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networkObject,
            },
          ],
        });
      }
    }
  };
