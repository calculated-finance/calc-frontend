import { getFlowLayout } from '@components/Layout';
import { FormNames } from '@hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { StrategyType } from '@models/StrategyType';
import { Assets } from '@components/AssetsPageAndForm';
import { StrategyInfoProvider } from '@hooks/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.WeightedScaleOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.WeightedScaleOut,
      }}
    >
      <Assets />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
