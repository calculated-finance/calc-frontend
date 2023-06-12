import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { getFlowLayout } from '@components/Layout';
import { ModalWrapper } from '@components/ModalWrapper';
import dcaOutSteps from '@formConfig/dcaOut';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import usePageLoad from '@hooks/usePageLoad';
import { StrategyTypes } from '@models/StrategyTypes';

function Page() {
  const { isPageLoading } = usePageLoad();

  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={dcaOutSteps} reset={resetForm(FormNames.DcaOut)}>
      <CustomiseFormDcaWrapper formName={FormNames.DcaIn} strategyType={StrategyTypes.DCAOut} steps={dcaOutSteps} />
    </ModalWrapper>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
