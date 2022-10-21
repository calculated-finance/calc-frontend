import { Badge, Tooltip } from '@chakra-ui/react';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyStatus } from '../helpers/getStrategyStatus';

export function StrategyStatusBadge({ strategy }: { strategy: Strategy }) {
  const status = getStrategyStatus(strategy);

  const statusColorSchemes = {
    active: 'green',
    scheduled: 'yellow',
    completed: 'blue',
  };

  const statusTooltips = {
    active: 'Your strategy has started',
    scheduled: 'Your strategy is scheduled to start',
    completed: 'Your strategy has completed',
  };

  return (
    <Tooltip label={statusTooltips[status]}>
      <Badge cursor="default" colorScheme={statusColorSchemes[status] || 'grey'} textTransform="capitalize">
        {status}
      </Badge>
    </Tooltip>
  );
}
