import { getFlowLayout } from '@components/Layout';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';

function Success() {
  return <SuccessStrategyModal stepConfig={weightedScaleOutSteps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
