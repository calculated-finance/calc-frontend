import { Contract, ContractRunner } from 'ethers';
import { ETH_DCA_FACTORY_CONTRACT_ADDRESS } from 'src/constants';
import contract from './Factory.json';

export default function getFactoryContract(contractRunner: ContractRunner) {
  return new Contract(ETH_DCA_FACTORY_CONTRACT_ADDRESS, contract.abi, contractRunner);
}
