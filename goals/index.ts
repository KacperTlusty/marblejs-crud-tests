import { combineRoutes, r } from '@marblejs/core'
import { makeReadGoals, makeWriteGoal, makeDeleteGoal, makeUpdateGoal } from './effects'

const postGoal$ = db => r.pipe(
  r.matchPath('/'),
  r.matchType('POST'),
  r.useEffect(makeWriteGoal(db))
)

const findGoals$ = db => r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(makeReadGoals(db))
)

const updateGoal$ = db => r.pipe(
  r.matchPath('/:id'),
  r.matchType('PUT'),
  r.useEffect(makeUpdateGoal(db))
)

const deleteGoal$ = db => r.pipe(
  r.matchPath('/:id'),
  r.matchType('DELETE'),
  r.useEffect(makeDeleteGoal(db))
)

export const goals$ = db => combineRoutes('/goal', [
  postGoal$(db),
  findGoals$(db),
  updateGoal$(db),
  deleteGoal$(db)
])
