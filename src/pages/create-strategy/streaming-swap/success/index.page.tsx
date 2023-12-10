import { getFlowLayout } from '@components/Layout';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';
import streamingSwapSteps from '@formConfig/streamingSwap';

function Success() {
  return <SuccessStrategyModal stepConfig={[streamingSwapSteps[1]]} />;
}
Success.getLayout = getFlowLayout;

export default Success;
