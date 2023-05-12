import { getFlowLayout } from '@components/Layout';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';

function Success() {
  return <SuccessStrategyModal stepConfig={weightedScaleInSteps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
