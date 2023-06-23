import { Contract, ContractRunner } from 'ethers';
import { ETH_DCA_EVENT_MANAGER_ADDRESS } from 'src/constants';
import contract from './EventManager.json';

export default function getEventManagerContract(contractRunner: ContractRunner) {
  return new Contract(ETH_DCA_EVENT_MANAGER_ADDRESS, contract.abi, contractRunner);
}
