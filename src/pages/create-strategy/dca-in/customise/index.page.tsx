import { getFlowLayout } from '@components/Layout';
import { StrategyTypes } from '@models/StrategyTypes';
import dcaInSteps from 'src/formConfig/dcaIn';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import usePageLoad from '@hooks/usePageLoad';
import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { ModalWrapper } from '@components/ModalWrapper';

function Page() {
  const { isPageLoading } = usePageLoad();

  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={dcaInSteps} reset={resetForm(FormNames.DcaIn)}>
      <CustomiseFormDcaWrapper formName={FormNames.DcaIn} strategyType={StrategyTypes.DCAIn} steps={dcaInSteps} />
    </ModalWrapper>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
