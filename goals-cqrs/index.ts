import { combineRoutes } from "@marblejs/core";
import { createGoal$, finishGoal$, updateGoal$, deleteGoal$ } from "./effects/createGoal.effect";

export const goalsCQRS$ = combineRoutes('/cqrsgoal', [
  createGoal$,
  finishGoal$,
  updateGoal$,
  deleteGoal$
])
