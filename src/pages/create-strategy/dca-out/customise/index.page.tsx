import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { lazy, Suspense } from 'react';
import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import dcaOutSteps from '@formConfig/dcaOut';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

const ModalWrapper = lazy(() => import('@components/ModalWrapper'));

function Page() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaOut,
      }}
    >
      <Suspense>
        <ModalWrapper stepsConfig={dcaOutSteps} reset={resetForm(FormNames.DcaOut)}>
          <CustomiseFormDcaWrapper steps={dcaOutSteps} />
        </ModalWrapper>
      </Suspense>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
