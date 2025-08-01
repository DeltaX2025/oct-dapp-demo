import { useEffect } from "react";
import { useSuiClientContext } from "@onelabs/dapp-kit";
import { useWalletNetwork } from "../hooks/useWalletNetwork";

export function AutoNetworkSwitch() {
  const { network: dappNetwork, selectNetwork } = useSuiClientContext();
  const walletNetwork = useWalletNetwork();

  useEffect(() => {
    if (walletNetwork && walletNetwork !== dappNetwork) {
      // Only switch to supported networks
      const supportedNetworks = ['mainnet', 'testnet', 'devnet'];
      if (supportedNetworks.includes(walletNetwork)) {
        console.log(`Auto-switching from ${dappNetwork} to ${walletNetwork} (wallet network)`);
        selectNetwork(walletNetwork);
      }
    }
  }, [walletNetwork, dappNetwork, selectNetwork]);

  // This component doesn't render anything, it just handles auto-switching
  return null;
}