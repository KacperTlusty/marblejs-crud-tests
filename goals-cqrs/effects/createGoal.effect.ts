import { r, useContext, HttpStatus, matchEvent, act } from "@marblejs/core";
import { pipe } from 'fp-ts/lib/pipeable'
import { goalDtoBodyValidator$, updateGoalDtoValidator$, goalIdParamValidator$ } from './validators/goal.validator'
import { mergeMap, mapTo } from "rxjs/operators";
import { createGoal } from "../models/goal";
import { EventBusClientToken } from "@marblejs/messaging";
import { GoalCommand } from "../commands";

export const createGoal$ = r.pipe(
  r.matchPath('/'),
  r.matchType('POST'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask)
    return req$.pipe(
      goalDtoBodyValidator$,
      mergeMap(req => {
        const goal = createGoal(req.body)

        return pipe(
          GoalCommand.createGoal(goal),
          eventBusClient.send
        )
      }),
      mapTo({ status: HttpStatus.ACCEPTED })
    )
  })
)

export const updateGoal$ = r.pipe(
  r.matchPath('/:goalId'),
  r.matchType('PUT'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask)

    return req$.pipe(
      updateGoalDtoValidator$,
      mergeMap(({ body, params }) => {
        const goal = createGoal(({
          ...body,
          id: params.goalId
        }))

        return pipe(
          GoalCommand.createGoal(goal),
          eventBusClient.send
        )
      }),
      mapTo({ status: HttpStatus.ACCEPTED })
    )
  })
)

export const finishGoal$ = r.pipe(
  r.matchPath('/:goalId/finish'),
  r.matchType('POST'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask)

    return req$.pipe(
      goalIdParamValidator$,
      mergeMap(({ params }) => pipe(
        params.goalId,
        GoalCommand.finishGoal,
        eventBusClient.send
      )),
      mapTo({ status: HttpStatus.ACCEPTED })
    )
  })
)

export const deleteGoal$ = r.pipe(
  r.matchPath('/:goalId/finish'),
  r.matchType('DELETE'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask)

    return req$.pipe(
      goalIdParamValidator$,
      mergeMap(({ params }) => pipe(
        params.goalId,
        GoalCommand.removeGoal,
        eventBusClient.send
      )),
      mapTo({ status: HttpStatus.ACCEPTED })
    )
  })
)