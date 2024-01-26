import { getFlowLayout } from '@components/Layout';
import { FormNames } from '@hooks/useFormStore';
import { StrategyType } from '@models/StrategyType';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from '@pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Assets } from '@components/AssetsPageAndForm';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.DCAOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaOut,
      }}
    >
      <Assets />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
