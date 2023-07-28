import { getFlowLayout } from '@components/Layout';
import { StrategyTypes } from '@models/StrategyTypes';
import dcaInSteps from 'src/formConfig/dcaIn';
import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import { FormNames, useFormStore } from '@hooks/useFormStore';
import { CustomiseFormDcaWrapper } from '@components/Forms/CustomiseForm/CustomiseFormDca';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from './useStrategyInfo';

const ModalWrapper = React.lazy(() =>
  import('@components/ModalWrapper').then((module) => ({ default: module.ModalWrapper })),
);

function Page() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <Suspense fallback={<Box />}>
        <ModalWrapper stepsConfig={dcaInSteps} reset={resetForm(FormNames.DcaIn)}>
          <CustomiseFormDcaWrapper steps={dcaInSteps} />
        </ModalWrapper>
      </Suspense>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
