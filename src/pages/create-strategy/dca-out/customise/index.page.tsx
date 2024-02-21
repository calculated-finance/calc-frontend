import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { getFlowLayout } from '@components/Layout';
import { ModalWrapper } from '@components/ModalWrapper';
import { TransactionType } from '@components/TransactionType';
import dcaOutSteps from '@formConfig/dcaOut';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { StrategyType } from '@models/StrategyType';
import { StrategyInfoProvider } from '@hooks/useStrategyInfo';

function Page() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.DCAOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaOut,
      }}
    >
      <ModalWrapper stepsConfig={dcaOutSteps} reset={resetForm(FormNames.DcaOut)}>
        <CustomiseFormDcaWrapper steps={dcaOutSteps} />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
