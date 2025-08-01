import { useSuiClientContext } from "@onelabs/dapp-kit";
import { Flex, Text, Select } from "@radix-ui/themes";
import { getTokensByNetwork, TokenInfo } from "../config/tokens";

interface TokenSelectorProps {
  selectedToken: TokenInfo | null;
  onTokenChange: (token: TokenInfo) => void;
}

export function TokenSelector({ selectedToken, onTokenChange }: TokenSelectorProps) {
  const { network } = useSuiClientContext();
  const tokens = getTokensByNetwork(network);

  return (
    <Flex direction="column" gap="2">
      <Text size="2" weight="medium">选择代币</Text>
      <Select.Root
        value={selectedToken?.id || ""}
        onValueChange={(tokenId) => {
          const token = tokens.find(t => t.id === tokenId);
          if (token) {
            onTokenChange(token);
          }
        }}
      >
        <Select.Trigger variant="soft" />
        <Select.Content>
          {tokens.map((token) => (
            <Select.Item key={token.id} value={token.id}>
              {token.name} ({token.symbol})
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}