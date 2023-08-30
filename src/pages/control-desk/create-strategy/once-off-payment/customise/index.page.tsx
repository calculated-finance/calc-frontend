import { getFlowLayout } from '@components/Layout';
import { ModalWrapper } from '@components/ModalWrapper';
import { TransactionType } from '@components/TransactionType';
import { ControlDeskStrategyTypes } from 'src/pages/control-desk/ControlDeskStrategyTypes';
import onceOffSteps from 'src/pages/control-desk/onceOffForm';
import { ControlDeskFormNames, useControlDeskFormStore } from 'src/pages/control-desk/useControlDeskFormStore';
import { ControlDeskStrategyInfoProvider } from 'src/pages/control-desk/useControlDeskStrategyInfo';
import { CustomiseFormOnceOffWrapper } from '../Forms/CustomiseFormOnceOffPayment';

function Page() {
  const { resetForm } = useControlDeskFormStore();

  return (
    <ControlDeskStrategyInfoProvider strategyInfo={{
      strategyType: ControlDeskStrategyTypes.OnceOffPayment,
      transactionType: TransactionType.Sell,
      formName: ControlDeskFormNames.OnceOffPayment,
    }}>
      <ModalWrapper stepsConfig={onceOffSteps} reset={resetForm(ControlDeskFormNames.OnceOffPayment)}>
        <CustomiseFormOnceOffWrapper
          steps={onceOffSteps}
        />
      </ModalWrapper>
    </ControlDeskStrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
