import * as cuid from 'cuid'

export type Goal = {
  name: string;
  id: string;
}

export type GoalArgs = {
  name: string;
  id?: string;
}

export const createGoal = ({
  name,
  id = cuid()
}: GoalArgs): Goal => {
  return {
    name,
    id
  }
}
