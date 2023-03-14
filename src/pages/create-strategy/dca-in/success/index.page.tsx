import { getFlowLayout } from '@components/Layout';
import steps from 'src/formConfig/dcaIn';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';

function Success() {
  return <SuccessStrategyModal stepConfig={steps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
