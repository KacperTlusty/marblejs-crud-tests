import { createEvent, EventsUnion } from '@marblejs/core';
import { Goal } from '../../goals/models'

enum GoalEventType {
  GOAL_CREATED = 'GOAL_CREATED',
  GOAL_UPDATED = 'GOAL_UPDATED',
  GOAL_REMOVED = 'GOAL_REMOVED',
  GOAL_FINISHED = 'GOAL_FINISHED'
}

export const GoalEvent = {
  goalCreated: createEvent(
    GoalEventType.GOAL_CREATED,
    (goal: Goal) => ({ goal, id: goal.id })
  ),
  goalUpdated: createEvent(
    GoalEventType.GOAL_UPDATED,
    (goal: Goal) => ({ goal, id: goal.id }),
  ),
  goalRemoved: createEvent(
    GoalEventType.GOAL_REMOVED,
    (id: string) => ({ id }),
  ),
  goalFinished: createEvent(
    GoalEventType.GOAL_FINISHED,
    (id: string) => ({ id })
  )
}

export type GoalEvent = EventsUnion<typeof GoalEvent>
