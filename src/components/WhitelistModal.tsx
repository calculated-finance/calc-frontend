import NewStrategyModal, { NewStrategyModalBody } from '@components/NewStrategyModal';

export function WhitelistModal() {
  return (
    <NewStrategyModal>
      <NewStrategyModalBody stepsConfig={[]}>
        This address is not on the whitelist. How about a game
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
