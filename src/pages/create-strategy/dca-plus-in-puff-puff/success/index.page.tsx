import { getFlowLayout } from '@components/Layout';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { SuccessStrategyModal } from '../../../../components/SuccessStrategyModal';

function Success() {
  return <SuccessStrategyModal stepConfig={dcaPlusInSteps} />;
}
Success.getLayout = getFlowLayout;

export default Success;
