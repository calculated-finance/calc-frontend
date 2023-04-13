import { Flex, Image } from '@chakra-ui/react';
import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import { findAsset, useAssetList } from '../hooks/useAssetList';

export function PoolDenomIcons({ pool }: { pool: Pool }) {
  const { data: assetData } = useAssetList();

  const assetIn = findAsset(assetData.assets, pool.poolAssets[0].token?.denom);
  const assetOut = findAsset(assetData.assets, pool.poolAssets[1].token?.denom);

  return (
    <Flex position="relative" w={8} h={5}>
      <Flex as="span" position="absolute" right="px">
        <Image
          data-testid={`denom-icon-${assetIn?.symbol}`}
          display="inline"
          src={assetIn?.logo_URIs?.svg}
          width={5}
          height={5}
        />
      </Flex>
      <Flex as="span" position="absolute" left="px">
        <Image
          data-testid={`denom-icon-${assetOut?.symbol}`}
          display="inline"
          src={assetOut?.logo_URIs?.svg}
          width={5}
          height={5}
        />
      </Flex>
    </Flex>
  );
}
