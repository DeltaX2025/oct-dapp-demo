import { useCurrentAccount, useSuiClientContext } from "@onelabs/dapp-kit";
import { Container, Flex, Heading, Text, Badge } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";
import { OctBalance } from "./components/OctBalance";
import { useWalletNetwork, useNetworkMismatch } from "./hooks/useWalletNetwork";

export function WalletStatus() {
  const account = useCurrentAccount();
  const { network: dappNetwork } = useSuiClientContext();
  const walletNetwork = useWalletNetwork();
  const { hasMismatch } = useNetworkMismatch();

  console.log("Wallet Status - Account:", JSON.stringify(account, null, 2));
  console.log("DApp Network:", dappNetwork);
  console.log("Wallet Network:", walletNetwork);
  console.log("Has Mismatch:", hasMismatch);

  return (
    <Container my="2">
      <Heading mb="2">Wallet Status</Heading>

      {account ? (
        <Flex direction="column" gap="2">
          <Text>Wallet connected</Text>
          <Text>Address: {account.address}</Text>
          
          <OctBalance />
          
          <Flex align="center" gap="2">
            <Text>DApp Network:</Text>
            <Badge color="blue">{dappNetwork}</Badge>
          </Flex>
          
          {walletNetwork && (
            <Flex align="center" gap="2">
              <Text>Wallet Network:</Text>
              <Badge color={hasMismatch ? "red" : "green"}>
                {walletNetwork}
              </Badge>
              {hasMismatch && (
                <Text size="1" color="red">
                  (Mismatch detected!)
                </Text>
              )}
            </Flex>
          )}
          
          {account.chains && account.chains.length > 0 && (
            <Flex direction="column" gap="1">
              <Text size="2">Supported chains:</Text>
              <Text size="1" color="gray">
                {account.chains.join(", ")}
              </Text>
            </Flex>
          )}
        </Flex>
      ) : (
        <Text>Wallet not connected</Text>
      )}
      <OwnedObjects />
    </Container>
  );
}
