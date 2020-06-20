import { MsgEffect, reply } from "@marblejs/messaging"
import { useContext, matchEvent, act } from "@marblejs/core"
import { from } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { pipe } from "fp-ts/lib/pipeable"
import { storeEventToken } from "../effects/db/store-event.effect"
import { GoalCommand } from "../commands"
import { GoalEvent } from "."

export const createGoal$: MsgEffect = (event$, ctx) => {
  const storeEvent = useContext(storeEventToken)(ctx.ask)

  return event$.pipe(
    matchEvent(GoalCommand.createGoal),
    act(event => pipe(
      event.payload.goal,
      goal => from(storeEvent(GoalEvent.goalCreated(goal))),
      mergeMap(() => [reply(event)({ type: event.type })]),
    ))
  )
}

export const updateGoalEvent$: MsgEffect = (event$, ctx) => {
  const storeEvent = useContext(storeEventToken)(ctx.ask)

  return event$.pipe(
    matchEvent(GoalCommand.updateGoal),
    act(event => pipe(
      event.payload.goal,
      goal => from(storeEvent(GoalEvent.goalUpdated(goal))),
      mergeMap(() => [reply(event)({ type: event.type })])
    ))
  )
}

export const finishGoal$: MsgEffect = (event$, ctx) => {
  const storeEvent = useContext(storeEventToken)(ctx.ask)

  return event$.pipe(
    matchEvent(GoalCommand.finishGoal),
    act(event => from(storeEvent(GoalEvent.goalFinished(event.payload.id))).pipe(
        mergeMap(() => [reply(event)({ type: event.type })])
      ))
  )
}

export const removeGoal$: MsgEffect = (event$, ctx) => {
  const storeEvent = useContext(storeEventToken)(ctx.ask)

  return event$.pipe(
    matchEvent(GoalCommand.finishGoal),
    act(event => from(storeEvent(GoalEvent.goalFinished(event.payload.id))).pipe(
      mergeMap(() => [reply(event)({ type: event.type })])
    ))
  )
}
