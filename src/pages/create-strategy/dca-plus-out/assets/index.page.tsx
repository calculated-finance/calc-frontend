import { getFlowLayout } from '@components/Layout';
import { FormNames } from '@hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { StrategyType } from '@models/StrategyType';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';
import { Assets } from '../../../../components/AssetsPageAndForm';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.DCAPlusOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaPlusOut,
      }}
    >
      <Assets />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
