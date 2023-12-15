import { getFlowLayout } from '@components/Layout';
import { FormNames } from '@hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from '../customise/useStrategyInfo';
import { Assets } from '../../../../components/AssetsPageAndForm';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAIn,
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
