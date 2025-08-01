import { useCurrentAccount, useSuiClientQuery } from "@onelabs/dapp-kit";
import { Flex, Text, Spinner } from "@radix-ui/themes";
import { TokenInfo } from "../config/tokens";

interface TokenBalanceProps {
  token: TokenInfo;
}

export function TokenBalance({ token }: TokenBalanceProps) {
  const account = useCurrentAccount();
  
  const { data, isPending, error } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address as string,
      coinType: token.coinType,
    },
    {
      enabled: !!account,
    },
  );

  if (!account) {
    return null;
  }

  if (error) {
    return (
      <Flex align="center" gap="2">
        <Text size="2">余额:</Text>
        <Text size="2" color="red">加载失败</Text>
      </Flex>
    );
  }

  if (isPending || !data) {
    return (
      <Flex align="center" gap="2">
        <Text size="2">余额:</Text>
        <Spinner size="1" />
      </Flex>
    );
  }

  // Convert from smallest unit to token unit based on decimals
  const balance = Number(data.totalBalance) / Math.pow(10, token.decimals);
  
  return (
    <Flex align="center" gap="2">
      <Text size="2">余额:</Text>
      <Text size="2" weight="medium">
        {balance.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: token.decimals,
        })} {token.symbol}
      </Text>
    </Flex>
  );
}