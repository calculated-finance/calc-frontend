import { getFlowLayout } from '@components/Layout';
import { StrategyTypes } from '@models/StrategyTypes';
import dcaInSteps from 'src/formConfig/dcaIn';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { ModalWrapper } from '@components/ModalWrapper';
import { TransactionType } from '@components/TransactionType';
import {   StrategyInfoProvider } from './useStrategyInfo';


function Page() {
  const { resetForm } = useFormStore();


  return (
    <StrategyInfoProvider strategyInfo={{
      strategyType: StrategyTypes.DCAIn,
      transactionType: TransactionType.Buy,
      formName: FormNames.DcaIn,
    }}>
      <ModalWrapper stepsConfig={dcaInSteps} reset={resetForm(FormNames.DcaIn)}>
        <CustomiseFormDcaWrapper
          steps={dcaInSteps}
        />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
