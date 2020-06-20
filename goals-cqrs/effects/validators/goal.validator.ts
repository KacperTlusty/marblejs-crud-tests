import { requestValidator$, t } from "@marblejs/middleware-io";
import { GoalDto } from "../../dto/goal.dto";

export const goalDtoBodyValidator$ = requestValidator$({
  body: GoalDto
})


export const updateGoalDtoValidator$ = requestValidator$({
  body: GoalDto,
  params: t.type({
    goalId: t.string
  })
})

export const goalIdParamValidator$ = requestValidator$({
  params: t.type({
    goalId: t.string
  })
})
