import { Db } from 'mongodb'
import { createContextToken, reader, bindTo, createReader } from '@marblejs/core'
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Reader';
import * as O from 'fp-ts/lib/Option';
import { GoalEvent } from '../../events'

export const storeEventToken = createContextToken<(goal: GoalEvent) => Promise<GoalEvent>>('Store_goal_event')
export const readGoalEventsToken = createContextToken<(goalId: string) => Promise<GoalEvent[]>>('Read_goal_event')

export const createStoreGoalEvent = (db: Db) => createReader(() => event => db.collection('Goals').insertOne(event).then(() => event))

export const readEventsForGoal = (db: Db) => pipe(reader, R.map(ask => pipe(
  ask(readGoalEventsToken),
  O.map(id => db.collection<GoalEvent>('Goal_events').find({ 'payload.id': id }).toArray()),
)))

export const storeGoalEventBind = (db: Db) => bindTo(storeEventToken)(createStoreGoalEvent(db))
export const readEventsForGoalBind = (db: Db) => bindTo(readGoalEventsToken)(readEventsForGoal(db))
