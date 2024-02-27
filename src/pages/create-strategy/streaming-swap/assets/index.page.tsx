import { TransactionType } from '@components/TransactionType';
import { FormNames } from '@hooks/useFormStore';
import { StrategyType } from '@models/StrategyType';
import { getFlowLayout } from '@components/Layout';
import { StreamingSwapForm } from '@components/StreamingSwapForm';
import { StrategyInfoProvider } from '@hooks/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.SimpleDCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.SimpleDcaIn,
      }}
    >
      <StreamingSwapForm />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
