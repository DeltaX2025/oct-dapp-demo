import { useCurrentAccount, useSuiClientQuery } from "@onelabs/dapp-kit";
import { Flex, Text, Spinner } from "@radix-ui/themes";
import { MIST_PER_SUI, SUI_TYPE_ARG } from "@onelabs/sui/utils";

export function OctBalance() {
  const account = useCurrentAccount();

  const { data, isPending, error } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address as string,
      coinType: SUI_TYPE_ARG,
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
        <Text size="2">Balance:</Text>
        <Text size="2" color="red">Error loading balance</Text>
      </Flex>
    );
  }

  if (isPending || !data) {
    return (
      <Flex align="center" gap="2">
        <Text size="2">Balance:</Text>
        <Spinner size="1" />
      </Flex>
    );
  }

  // Convert from smallest unit to OCT (1 OCT = 10^9 smallest units)
  const octBalance = Number(data.totalBalance) / Number(MIST_PER_SUI);

  return (
    <Flex align="center" gap="2">
      <Text size="2">Balance:</Text>
      <Text size="2" weight="medium">
        {octBalance.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        })} OCT
      </Text>
    </Flex>
  );
}
