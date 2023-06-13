import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { getFlowLayout } from '@components/Layout';
import { ModalWrapper } from '@components/ModalWrapper';
import dcaOutSteps from '@formConfig/dcaOut';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';

function Page() {
  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={dcaOutSteps} reset={resetForm(FormNames.DcaOut)}>
      <CustomiseFormDcaWrapper formName={FormNames.DcaOut} strategyType={StrategyTypes.DCAOut} steps={dcaOutSteps} />
    </ModalWrapper>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
