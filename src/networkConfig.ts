import { getFullnodeUrl } from "@onelabs/sui/client";
import { createNetworkConfig } from "@onelabs/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: "https://rpc-testnet.onelabs.cc:443",
    },
    mainnet: {
      // Override the incorrect URL from published package
      url: "https://rpc-mainnet.onelabs.cc:443",
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
