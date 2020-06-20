import { t } from '@marblejs/middleware-io'

export const GoalDto = t.type({
  name: t.string
})

export type GoalDto = t.TypeOf<typeof GoalDto>
