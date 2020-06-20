import { HttpEffect, use, HttpError, HttpStatus,  } from '@marblejs/core'
import { Db } from 'mongodb'
import { readGoals, createGoal as createGoalDb, updateGoal, removeGoal } from './db.effect'
import { map, mergeMap } from 'rxjs/operators'
import { requestValidator$, t } from '@marblejs/middleware-io'
import { GoalDto } from '../dto/goal.dto'
import { createGoal } from '../models/goal'
import { of, throwError } from 'rxjs'

const goalDtoBodyValidator$ = requestValidator$({
  body: GoalDto
})

const validateIdParam$ = requestValidator$({
  params: t.type({
    id: t.string
  })
})

export const makeReadGoals: (db: Db) => HttpEffect = (db: Db) =>
  req$ => 
    req$.pipe(
      mergeMap(() => readGoals(db)()),
      map(goals => ({ body: goals }))
    )

export const makeWriteGoal: (db: Db) => HttpEffect = db => 
  req$ =>
    req$.pipe(
      use(goalDtoBodyValidator$),
      map(req => createGoal(req.body)),
      mergeMap(createGoalDb(db)),
      map(goal => ({ body: goal }))
    )

export const makeUpdateGoal: (db: Db) => HttpEffect = db =>
  req$ =>
    req$.pipe(
      use(goalDtoBodyValidator$),
      use(validateIdParam$),
      map(req => createGoal({ ...req.body, id: req.params.id })),
      mergeMap(updateGoal(db)),
      map(goal => ({ body: goal }))
    )

export const makeDeleteGoal: (db: Db) => HttpEffect = db =>
  req$ =>
    req$.pipe(
      use(validateIdParam$),
      map(req => req.params.id),
      mergeMap(removeGoal(db)),
      mergeMap(result => result
          ? of({ status: 204 })
          : throwError(new HttpError('Nothing deleted', HttpStatus.BAD_REQUEST)))
    )