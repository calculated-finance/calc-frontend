import { getFlowLayout } from '@components/Layout';
import dcaInSteps from 'src/formConfig/dcaIn';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';

function Success() {
  return <SuccessStrategyModal stepConfig={dcaInSteps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
