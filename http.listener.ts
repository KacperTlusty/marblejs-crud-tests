import { httpListener } from '@marblejs/core'
import { logger$ } from '@marblejs/middleware-logger'
import { bodyParser$ } from '@marblejs/middleware-body'
import { messagingListener } from '@marblejs/messaging'

import { goals$ } from './goals'
import { goalsCQRS$ } from './goals-cqrs'
import * as CommandHandlers from './goals-cqrs/events/event.effects'

const middlewares = [
  logger$(),
  bodyParser$()
]

const effects = db => [
  goals$(db),
  goalsCQRS$
]

export const listener = db => httpListener({
  middlewares,
  effects: effects(db)
})

export const mListener = messagingListener({
  effects: [
    CommandHandlers.createGoal$,
    CommandHandlers.finishGoal$,
    CommandHandlers.updateGoalEvent$
  ]
})
