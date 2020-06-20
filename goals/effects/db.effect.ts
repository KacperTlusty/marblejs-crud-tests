import * as R from 'ramda'
import { Collection, Db, FilterQuery } from 'mongodb'
import { Observable } from 'rxjs'
import { Goal } from '../models/goal'

type Identifyable = { id: string }
type DbType<T extends Identifyable> = Omit<T, 'id'> & { _id: string }

const mapModelToDb = <T extends Identifyable>(obj: T): DbType<T> => {
  const result = { ...obj, _id: obj.id }
  delete result.id
  return result
}

const mapDbToModel = <T extends Identifyable>(document: DbType<T>): T => {
  const result = { ...document, id: document._id }
  delete result._id
  return result as unknown as T
}

export const readGoals = (db: Db) => {
  const collection: Collection<DbType<Goal>> = db.collection('goal')
  return (query: FilterQuery<Goal> = {}): Observable<Goal[]> => 
    new Observable((emitter) => {
      collection
        .find(query)
        .toArray()
        .then(R.pipe(R.map(mapDbToModel), emitter.next.bind(emitter)))
        .catch(emitter.error.bind(emitter))
        .finally(emitter.complete.bind(emitter))
    })
}

export const createGoal = (db: Db) => {
  const collection: Collection<DbType<Goal>> = db.collection('goal')
  return (goal: Goal): Observable<Goal> => new Observable<Goal>((emitter) => {
    collection.insertOne(mapModelToDb(goal))
      .then(() => emitter.next(goal))
      .catch(emitter.error.bind(emitter))
      .finally(emitter.complete.bind(emitter))
  })
}

export const updateGoal = (db: Db) => {
  const collection: Collection<DbType<Goal>> = db.collection('goal')
  return (goal: Goal): Observable<Goal> => new Observable<Goal>(emitter => {
    collection.findOneAndReplace({
      _id: goal.id
    }, mapModelToDb(goal))
      .then(() => emitter.next(goal))
      .catch(emitter.error.bind(emitter))
      .finally(emitter.complete.bind(emitter))
  })
}

export const removeGoal = (db: Db) => {
  const collection: Collection<DbType<Goal>> = db.collection('goal')
  return (goalId: string): Observable<boolean> => new Observable<boolean>(emitter => {
    collection.deleteOne({ _id: goalId })
      .then(result => emitter.next(result.deletedCount === 1))
      .catch(emitter.error.bind(emitter))
      .finally(emitter.complete.bind(emitter))
  })
}
