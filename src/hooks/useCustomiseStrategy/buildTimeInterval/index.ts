import { CustomiseSchemaDca, CustomiseSchemaWeightedScale } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { getExecutionInterval } from '@hooks/useCreateVault/buildCreateVaultParams';
import { ConfigureVariables } from '../ConfigureVariables';

export function buildTimeInterval({ values, initialValues, strategy }: ConfigureVariables) {
  if (!isDcaPlus(strategy)) {
    const castedValues = values as CustomiseSchemaDca | CustomiseSchemaWeightedScale;
    const castedInvitialValues = initialValues as CustomiseSchemaDca | CustomiseSchemaWeightedScale;
    const isTimeIntervalDirty =
      castedValues.executionInterval !== castedInvitialValues.executionInterval ||
      castedValues.executionIntervalIncrement !== castedInvitialValues.executionIntervalIncrement;

    if (isTimeIntervalDirty) {
      return {
        time_interval: getExecutionInterval(castedValues.executionInterval, castedValues.executionIntervalIncrement),
      };
    }
  }
  return {};
}
