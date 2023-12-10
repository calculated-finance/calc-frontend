import { getFlowLayout } from '@components/Layout';
import { FormNames } from '@hooks/useFormStore';
import { StrategyType } from '@models/StrategyType';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from '../customise/useStrategyInfo';
import { Assets } from '../../../../components/AssetsPageAndForm';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <Assets />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
