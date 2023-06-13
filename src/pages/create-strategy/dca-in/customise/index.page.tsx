import { getFlowLayout } from '@components/Layout';
import { StrategyTypes } from '@models/StrategyTypes';
import dcaInSteps from 'src/formConfig/dcaIn';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { ModalWrapper } from '@components/ModalWrapper';
import { TransactionType } from '@components/TransactionType';

function Page() {
  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={dcaInSteps} reset={resetForm(FormNames.DcaIn)}>
      <CustomiseFormDcaWrapper
        formName={FormNames.DcaIn}
        strategyType={StrategyTypes.DCAIn}
        steps={dcaInSteps}
        transactionType={TransactionType.Buy}
      />
    </ModalWrapper>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
