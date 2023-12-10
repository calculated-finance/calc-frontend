import { TransactionType } from '@components/TransactionType';
import { FormNames } from '@hooks/useFormStore';
import { StrategyType } from '@models/StrategyType';
import { BrowserRouter } from 'react-router-dom';
import { getFlowLayout } from '@components/Layout';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';
import { Form } from '@components/StreamingSwapForm';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.SimpleDCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.SimpleDcaIn,
      }}
    >
      <BrowserRouter>
        <Form />
      </BrowserRouter>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
