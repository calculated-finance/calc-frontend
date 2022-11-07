import { findLast } from 'lodash'
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';

export function getLastExecutionDate(events: Event[] | undefined) {

  if (!events)
  {
    return '-'
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const lastExecutionEvent = findLast(events, (event: Event) => event.data.d_c_a_vault_execution_completed) as Event

  // vault has no executions yet
  if (!lastExecutionEvent)
  {
    return '-'
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const lastExecutionDate = new Date(lastExecutionEvent.timestamp / 1000000)

  return lastExecutionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}