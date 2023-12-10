import { getFlowLayout } from '@components/Layout';
import { FormNames } from 'src/hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { StrategyType } from '@models/StrategyType';
import { Assets } from '@components/AssetsPageAndForm';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.WeightedScaleIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.WeightedScaleIn,
      }}
    >
      <Assets />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
