import { ChainType } from '@helpers/chains';
import { Chains } from '@hooks/useChain/Chains';

export const mockChainConfig = {
  name: Chains.Kujira,
  chainType: ChainType.Cosmos,
  contractAddress: 'contractAddress',
  feeTakerAddress: 'feeTakerAddress',
  autoCompoundStakingRewardsAddress: 'autoCompoundStakingRewardsAddress',
};
