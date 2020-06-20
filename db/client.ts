import { connect, Db } from 'mongodb'

const client = connect('mongodb://root:example@127.0.0.1:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export const getDb = (dbName: string): Promise<Db> => {
  return client
    .then(client => client.db(dbName))
    .catch(err => {
      console.error(err)
      throw new Error(err.message)
    })
}
