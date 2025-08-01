import { useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientContext, useSuiClient } from "@onelabs/dapp-kit";
import { Transaction } from "@onelabs/sui/transactions";
import { Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { TokenSelector } from "./components/TokenSelector";
import { TokenBalance } from "./components/TokenBalance";
import { getTokensByNetwork, TokenInfo } from "./config/tokens";
import { SUI_TYPE_ARG } from "@onelabs/sui/utils";

export function Transfer() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { network } = useSuiClientContext();
  const suiClient = useSuiClient();

  const [recipient, setRecipient] = useState("0x516eb7441def64f213c04bad190e3ac6d55bfd61f3d5305abca65ba865c6dde7");
  const [amount, setAmount] = useState("0.01");
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize with default token (OCT) when network changes
  useEffect(() => {
    const tokens = getTokensByNetwork(network);
    const octToken = tokens.find(t => t.id === 'oct');
    if (octToken) {
      setSelectedToken(octToken);
    }
  }, [network]);

  const handleTransfer = async () => {
    if (!account || !recipient || !amount || !selectedToken) {
      setError("请填写完整信息");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const tx = new Transaction();
      const amountInSmallestUnit = Math.floor(
        parseFloat(amount) * Math.pow(10, selectedToken.decimals)
      );

      if (selectedToken.coinType === SUI_TYPE_ARG) {
        // For OCT (native token), use gas coins
        const [coin] = tx.splitCoins(tx.gas, [amountInSmallestUnit]);
        tx.transferObjects([coin], recipient);
      } else {
        // For other tokens, query user's coins first
        const coins = await suiClient.getCoins({
          owner: account.address,
          coinType: selectedToken.coinType,
        });

        if (!coins.data || coins.data.length === 0) {
          setError(`您没有 ${selectedToken.symbol} 代币`);
          setIsLoading(false);
          return;
        }

        // Check if user has enough balance
        const totalBalance = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
        if (totalBalance < BigInt(amountInSmallestUnit)) {
          setError(`余额不足。需要 ${amount} ${selectedToken.symbol}`);
          setIsLoading(false);
          return;
        }

        // Use the first coin that has enough balance, or merge coins if needed
        const firstCoin = coins.data[0];
        if (BigInt(firstCoin.balance) >= BigInt(amountInSmallestUnit)) {
          // Single coin has enough balance
          const [transferCoin] = tx.splitCoins(tx.object(firstCoin.coinObjectId), [amountInSmallestUnit]);
          tx.transferObjects([transferCoin], recipient);
        } else {
          // Need to merge coins first
          const coinObjects = coins.data.map(coin => tx.object(coin.coinObjectId));
          const mergedCoin = coinObjects[0];
          if (coinObjects.length > 1) {
            tx.mergeCoins(mergedCoin, coinObjects.slice(1));
          }
          const [transferCoin] = tx.splitCoins(mergedCoin, [amountInSmallestUnit]);
          tx.transferObjects([transferCoin], recipient);
        }
      }

      signAndExecute(
        {
          transaction: tx as any,
        },
        {
          onSuccess: (result) => {
            setResult(result.digest);
            setRecipient("");
            setAmount("");
            setIsLoading(false);
          },
          onError: (error) => {
            setError(error.message);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "转账失败");
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <Card>
        <Flex direction="column" gap="3">
          <Heading size="4">转账</Heading>
          <Text>请先连接钱包</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Heading size="4">转账</Heading>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">接收地址</Text>
          <TextField.Root
            placeholder="输入接收地址"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Flex>

        <TokenSelector
          selectedToken={selectedToken}
          onTokenChange={setSelectedToken}
        />

        {selectedToken && <TokenBalance token={selectedToken} />}

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            转账金额 ({selectedToken?.symbol || "Token"})
          </Text>
          <TextField.Root
            placeholder={`输入转账金额 (${selectedToken?.symbol || "Token"})`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            step="any"
          />
        </Flex>

        <Button
          onClick={handleTransfer}
          disabled={isLoading || !recipient || !amount}
          loading={isLoading}
        >
          {isLoading ? "转账中..." : "确认转账"}
        </Button>

        {error && (
          <Text color="red" size="2">
            错误: {error}
          </Text>
        )}

        {result && (
          <Flex direction="column" gap="2">
            <Text color="green" size="2" weight="medium">
              转账成功!
            </Text>
            <Text size="1" style={{ wordBreak: "break-all" }}>
              交易ID: {result}
            </Text>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
