import { getFlowLayout } from '@components/Layout';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';
import dcaOutSteps from '@formConfig/dcaOut';

function Success() {
  return <SuccessStrategyModal stepConfig={dcaOutSteps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
