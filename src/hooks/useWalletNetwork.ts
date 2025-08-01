import { useCurrentAccount, useCurrentWallet, useSuiClientContext } from "@onelabs/dapp-kit";

export function useWalletNetwork(): string | null {
  const currentAccount = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();
  
  // Extract network from current account first (most specific)
  if (currentAccount?.chains && currentAccount.chains.length > 0) {
    const suiChain = currentAccount.chains.find(chain => chain.startsWith('sui:'));
    if (suiChain) {
      return suiChain.split(':')[1]; // Returns 'mainnet', 'testnet', etc.
    }
  }
  
  // Fallback to wallet's first supported chain
  if (currentWallet?.chains && currentWallet.chains.length > 0) {
    const suiChain = currentWallet.chains.find(chain => chain.startsWith('sui:'));
    if (suiChain) {
      return suiChain.split(':')[1];
    }
  }
  
  return null;
}

export function useNetworkMismatch() {
  const { network: dappNetwork } = useSuiClientContext();
  const walletNetwork = useWalletNetwork();
  
  return {
    hasMismatch: walletNetwork && walletNetwork !== dappNetwork,
    dappNetwork,
    walletNetwork,
  };
}