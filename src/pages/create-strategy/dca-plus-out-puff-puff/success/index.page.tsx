import { getFlowLayout } from '@components/Layout';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';
import dcaPlusOutSteps from '../dcaPlusOutSteps';

function Success() {
  return <SuccessStrategyModal stepConfig={dcaPlusOutSteps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
