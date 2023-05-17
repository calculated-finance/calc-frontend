import { Text } from '@chakra-ui/react';
import BadgeButton from '@components/BadgeButton';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { StartImmediatelyValues } from '@models/StartImmediatelyValues';
import TriggerTypes from '@models/TriggerTypes';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { WeightedScaleState } from '@models/weightedScaleFormData';

export function ImmediateTriggerInfo() {
  return (
    <>
      Starting{' '}
      <BadgeButton url="customise">
        <Text>Immediately</Text>
      </BadgeButton>
    </>
  );
}

export function TimeTriggerInfo({ state }: { state: DcaInFormDataAll | WeightedScaleState }) {
  const { startDate, purchaseTime } = state;

  const zone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

  const formattedTime = purchaseTime || '00:00';

  const formattedDate = startDate?.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      Starting{' '}
      <BadgeButton url="customise">
        <Text>{formattedDate}</Text>
      </BadgeButton>
      {Boolean(purchaseTime) && (
        <>
          {' '}
          at{' '}
          <BadgeButton url="customise">
            <Text>
              {formattedTime} {zone}
            </Text>
          </BadgeButton>
        </>
      )}
    </>
  );
}

export function PriceTriggerInfo({ state }: { state: DcaInFormDataAll | WeightedScaleState }) {
  const { initialDenom, resultingDenom, startPrice } = state;
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  return (
    <>
      Starting when{' '}
      <BadgeButton url="customise">
        <Text>1 {initialDenomName}</Text>
        <DenomIcon denomName={initialDenom} />
        <Text pt={1} fontSize="xs">
          &ge;
        </Text>
        <Text>
          {startPrice} {resultingDenomName}
        </Text>
        <DenomIcon denomName={resultingDenom} />
      </BadgeButton>
    </>
  );
}

export function SummaryTriggerInfo({ state }: { state: DcaInFormDataAll | WeightedScaleState }) {
  const { startImmediately, triggerType } = state;

  if (startImmediately === StartImmediatelyValues.Yes) {
    return <ImmediateTriggerInfo />;
  }
  if (triggerType === TriggerTypes.Date) {
    return <TimeTriggerInfo state={state} />;
  }
  return <PriceTriggerInfo state={state} />;
}
