import { useWallet } from '@hooks/useWallet';
import { DcaPlusPerformanceResponse as DcaPlusPerformanceResponseGenerated } from 'src/interfaces/dca/response/get_dca_plus_performance';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { useChainId } from '@hooks/useChainId';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';

export type DcaPlusPerformanceResponse = DcaPlusPerformanceResponseGenerated;

export default function useDcaPlusPerformance(id: Strategy['id'], enabled: boolean) {
  const { address } = useWallet();
  const { chainId: chain } = useChainId();
  const { cosmWasmClient } = useCosmWasmClient();

  return useQuery<DcaPlusPerformanceResponse>(
    ['strategy-dca-plus-performance', id, cosmWasmClient, address],
    () =>
      cosmWasmClient!.queryContractSmart(getChainContractAddress(chain), {
        get_vault_performance: {
          vault_id: id,
        },
      }),
    {
      enabled: !!cosmWasmClient && !!id && !!address && !!enabled && !!chain,
      meta: {
        errorMessage: 'Error fetching strategy performance',
      },
    },
  );
}
