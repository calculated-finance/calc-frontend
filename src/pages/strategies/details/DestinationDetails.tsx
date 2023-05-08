import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Heading,
  GridItem,
  Text,
  Badge,
  Button,
  Link as ChakraLink,
  Icon,
  useClipboard,
  useToast,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import { useWallet } from '@hooks/useWallet';
import { getMarsAddress, getMarsUrl } from '@helpers/chains';
import { Chains, useChain } from '@hooks/useChain';
import { truncate } from '@components/CosmosWallet';
import {
  getStrategyPostSwapType,
  getStrategyReinvestStrategyId,
  getStrategyValidatorAddress,
} from '@helpers/destinations';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { generateStrategyConfigureUrl } from '@components/TopPanel/generateStrategyConfigureUrl';
import { isStrategyCancelled, getStrategyResultingDenom } from '@helpers/strategy';
import useStrategy from '@hooks/useStrategy';
import useValidator from '@hooks/useValidator';
import { getDenomName } from '@utils/getDenomInfo';
import { HiOutlineCube } from 'react-icons/hi';
import Link from 'next/link';

export function ConfigureButton({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { chain } = useChain();
  return (
    <GridItem visibility={isStrategyCancelled(strategy) || chain !== Chains.Osmosis ? 'hidden' : 'visible'}>
      <Flex justify="end">
        <Link href={generateStrategyConfigureUrl(strategy.id)}>
          <Button size="xs" variant="ghost" colorScheme="brand" leftIcon={<Icon fontSize="md" as={HiOutlineCube} />}>
            Configure
          </Button>
        </Link>
      </Flex>
    </GridItem>
  );
}

export function ReinvestDetails({ strategy }: { strategy: StrategyOsmosis }) {
  const id = getStrategyReinvestStrategyId(strategy);
  const { data } = useStrategy(id);

  const { vault: reinvestStrategy } = data || {};

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Reinvesting into</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        {!reinvestStrategy ? (
          <Spinner size="xs" />
        ) : (
          <ChakraLink isExternal href={`/strategies/details/?id=${id}`}>
            <Text fontSize="sm" data-testid="strategy-receiving-address">
              Your {getDenomName(getStrategyResultingDenom(reinvestStrategy))} strategy <Icon as={ExternalLinkIcon} />
            </Text>
          </ChakraLink>
        )}
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  );
}

export function ValidatorDetails({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { chain } = useChain();
  const validatorAddress = getStrategyValidatorAddress(strategy, chain);
  const { validator, isLoading } = useValidator(validatorAddress);

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Auto staking status</Heading>
      </GridItem>
      <GridItem colSpan={2} data-testid="strategy-auto-staking-status">
        <Badge colorScheme="green">Active</Badge>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Validator name</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-validator-name">
          {isLoading ? <Spinner size="sm" /> : validator?.description?.moniker}
        </Text>
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  );
}

export function DestinationDetails({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { destinations } = strategy;
  const { chain } = useChain();

  const { address } = useWallet();

  const { onCopy } = useClipboard(destinations[0].address || '');
  const toast = useToast();

  const postSwapExecutionType = getStrategyPostSwapType(strategy, chain);

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'Address copied to clipboard',
      position: 'top',
      status: 'success',
      duration: 9000,
      isClosable: true,
      variant: 'subtle',
    });
  };

  if (postSwapExecutionType === PostPurchaseOptions.Stake) {
    return <ValidatorDetails strategy={strategy} />;
  }

  if (postSwapExecutionType === PostPurchaseOptions.GenerateYield) {
    return (
      <>
        <GridItem colSpan={1}>
          <Heading size="xs">Depositing to</Heading>
        </GridItem>
        <GridItem colSpan={1}>
          <ChakraLink isExternal href={getMarsUrl()}>
            <Text fontSize="sm" data-testid="strategy-receiving-address">
              Mars
            </Text>
          </ChakraLink>
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  if (postSwapExecutionType === PostPurchaseOptions.Reinvest) {
    return <ReinvestDetails strategy={strategy as StrategyOsmosis} />;
  }

  if (destinations[0].address !== address) {
    return (
      <>
        <GridItem colSpan={1}>
          <Heading size="xs">Sending to </Heading>
        </GridItem>
        <GridItem colSpan={1}>
          {destinations[0].address === getMarsAddress() ? (
            <ChakraLink isExternal href={getMarsUrl()}>
              <Text fontSize="sm" data-testid="strategy-receiving-address">
                Mars
              </Text>
            </ChakraLink>
          ) : (
            <Button
              variant="link"
              colorScheme="blue"
              rightIcon={<Icon as={CopyIcon} />}
              fontSize="sm"
              data-testid="strategy-receiving-address"
              onClick={handleCopy}
            >
              {truncate(destinations[0].address)}
            </Button>
          )}
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  return chain === Chains.Osmosis ? (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Post-swap action</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Badge>None</Badge>
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  ) : null;
}
