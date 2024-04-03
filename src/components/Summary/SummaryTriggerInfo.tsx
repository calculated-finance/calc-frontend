import { Text } from '@chakra-ui/react';
import BadgeButton from '@components/BadgeButton';
import DenomIcon from '@components/DenomIcon';
import TriggerTypes from '@models/TriggerTypes';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { InitialDenomInfo, ResultingDenomInfo } from '@utils/DenomInfo';
import YesNoValues from '@models/YesNoValues';

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

export function PriceTriggerInfo({
  initialDenom,
  resultingDenom,
  startPrice,
  transactionType,
}: {
  initialDenom: InitialDenomInfo;
  resultingDenom: ResultingDenomInfo;
  startPrice: number | null | undefined;
  transactionType: string;
}) {
  return (
    <>
      Starting when{' '}
      <BadgeButton url="customise">
        {transactionType === 'buy' ? (
          <>
            {' '}
            <Text>{resultingDenom.name}</Text>
            <DenomIcon denomInfo={resultingDenom} />
            <Text pt={1} fontSize="xs">
              &le;
            </Text>
            <Text>
              {startPrice} {initialDenom.name}
            </Text>
            <DenomIcon denomInfo={initialDenom} />
          </>
        ) : (
          <>
            <Text>1 {initialDenom.name}</Text>
            <DenomIcon denomInfo={initialDenom} />
            <Text pt={1} fontSize="xs">
              &ge;
            </Text>
            <Text>
              {startPrice} {resultingDenom.name}
            </Text>
            <DenomIcon denomInfo={resultingDenom} />
          </>
        )}
      </BadgeButton>
    </>
  );
}

export function SummaryTriggerInfo({
  state,
  transactionType,
}: {
  state: DcaInFormDataAll | WeightedScaleState;
  transactionType: string;
}) {
  const { startImmediately, triggerType, initialDenom, resultingDenom, startPrice } = state;

  if (!initialDenom || !resultingDenom) {
    return null;
  }

  if (startImmediately === YesNoValues.Yes) {
    return <ImmediateTriggerInfo />;
  }

  if (triggerType === TriggerTypes.Date) {
    return <TimeTriggerInfo state={state} />;
  }

  return (
    <PriceTriggerInfo
      initialDenom={initialDenom}
      resultingDenom={resultingDenom}
      transactionType={transactionType}
      startPrice={startPrice}
    />
  );
}
