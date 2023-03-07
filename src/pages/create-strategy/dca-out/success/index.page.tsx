import { getFlowLayout } from '@components/Layout';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';
import dcaOutSteps from '../dcaOutSteps';

function Success() {
  return <SuccessStrategyModal stepConfig={dcaOutSteps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
