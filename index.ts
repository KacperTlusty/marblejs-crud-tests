import { createServer, bindEagerlyTo } from '@marblejs/core'
import { IO } from 'fp-ts/lib/IO'
import { listener, mListener } from './http.listener'
import { getDb } from './db/client'
import { readEventsForGoalBind, storeGoalEventBind } from './goals-cqrs/effects/db/store-event.effect'
import { EventBusToken, eventBus, EventBusClientToken, eventBusClient } from '@marblejs/messaging'

const main: IO<void> = async () => {
  const db = await getDb('Goals')
  const server = createServer({
    dependencies: [
      readEventsForGoalBind(db),
      storeGoalEventBind(db),
      bindEagerlyTo(EventBusToken)(eventBus({ listener: mListener })),
      bindEagerlyTo(EventBusClientToken)(eventBusClient)
    ],
    listener: listener(db),
    port: 1337,
    hostname: '127.0.0.1'
  })

  return await (await server)()
}

main()
