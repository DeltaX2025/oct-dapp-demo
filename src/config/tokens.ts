import { SUI_TYPE_ARG } from "@onelabs/sui/utils";

export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  coinType: string;
}

export const SUPPORTED_TOKENS: Record<string, Record<string, TokenInfo>> = {
  mainnet: {
    oct: {
      id: "oct",
      name: "Oct",
      symbol: "OCT",
      decimals: 9,
      coinType: SUI_TYPE_ARG,
    },
    usdh: {
      id: "usdh",
      name: "USDH",
      symbol: "USDH",
      decimals: 9,
      coinType: "0x3d1ecd3dc3c8ecf8cb17978b6b5fe0b06704d4ed87cc37176a01510c45e21c92::usdh::USDH",
    },
  },
  testnet: {
    oct: {
      id: "oct",
      name: "Oct",
      symbol: "OCT",
      decimals: 9,
      coinType: SUI_TYPE_ARG,
    },
    usdh: {
      id: "usdh",
      name: "USDH",
      symbol: "USDH",
      decimals: 9,
      coinType: "0xacf6eeafdf94dec380bfb9c838a964aaa6db577d700fdb502e5de105053798b8::usdh::USDH",
    },
  },
  devnet: {
    oct: {
      id: "oct",
      name: "Oct",
      symbol: "OCT",
      decimals: 9,
      coinType: SUI_TYPE_ARG,
    },
  },
};

export function getTokensByNetwork(network: string): TokenInfo[] {
  return Object.values(SUPPORTED_TOKENS[network] || {});
}

export function getTokenInfo(network: string, tokenId: string): TokenInfo | undefined {
  return SUPPORTED_TOKENS[network]?.[tokenId];
}
