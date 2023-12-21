import { TransactionType } from '@components/TransactionType';
import { FormNames } from '@hooks/useFormStore';
import { StrategyType } from '@models/StrategyType';
import { getFlowLayout } from '@components/Layout';
import { Form } from '@components/StreamingSwapForm';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.SimpleDCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.SimpleDcaIn,
      }}
    >
      <Form />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
