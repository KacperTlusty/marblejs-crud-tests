import { createEvent, EventsUnion } from '@marblejs/core'
import { Goal } from '../../goals/models'

export enum GoalCommandType {
  CREATE_GOAL = 'CREATE_GOAL',
  UPDATE_GOAL = 'UPDATE_GOAL',
  REMOVE_GOAL = 'REMOVE_GOAL',
  FINISH_GOAL = 'FINISH_GOAL'
}

export const GoalCommand = {
  createGoal: createEvent(
    GoalCommandType.CREATE_GOAL,
    (goal: Goal) => ({ goal })
  ),
  updateGoal: createEvent(
    GoalCommandType.UPDATE_GOAL,
    (goal: Goal) => ({ goal }),
  ),
  removeGoal: createEvent(
    GoalCommandType.REMOVE_GOAL,
    (id: string) => ({ id })
  ),
  finishGoal: createEvent(
    GoalCommandType.FINISH_GOAL,
    (id: string) => ({ id })
  )
}

export type GoalCommand = EventsUnion<typeof GoalCommand>
