import { Badge, Tooltip } from '@chakra-ui/react';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyEndDate, getStrategyStatus } from '@helpers/strategy';
import useStrategyEvents from '@hooks/useStrategyEvents';

export function StrategyStatusBadge({ strategy }: { strategy: Strategy }) {
  const status = getStrategyStatus(strategy);
  const { data: events } = useStrategyEvents(strategy.id);

  const lastDate = getStrategyEndDate(strategy, events);

  const statusColorSchemes = {
    active: 'green',
    scheduled: 'yellow',
    completed: 'blue',
    cancelled: 'grey',
  };

  const statusTooltips = {
    active: 'Your strategy has started',
    scheduled: 'Your strategy is scheduled to start',
    completed: 'Your strategy has completed',
    cancelled: 'Your strategy has been cancelled',
  };

  return (
    <Tooltip label={statusTooltips[status]}>
      <Badge
        cursor="default"
        colorScheme={statusColorSchemes[status] || 'grey'}
        textTransform="capitalize"
        whiteSpace="pre-wrap"
      >
        {strategy.status === 'inactive' ? `${status}\n${lastDate}` : status}
      </Badge>
    </Tooltip>
  );
}
