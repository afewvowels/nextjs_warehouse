import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'

global.mongo = global.mongo || {}

let indexesCreated = false
export async function createIndexes(db) {
  await Promise.all([
    db.collection('bins').createIndex({ _id: 1 }),
    db.collection('prototypes').createIndex({ _id: 1 }),
    db.collection('items').createIndex({ _id: 1 }),
    db.collection('categories').createIndex({ _id: 1 }),
    db.collection('tags').createIndex({ _id: 1 }),
  ])
  indexesCreated = true
}

async function database(req, res, next) {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await global.mongo.client.connect()
  }
  req.dbClient = global.mongo.client
  req.db = global.mongo.client.db(process.env.MONGODB_DB)
  if (!indexesCreated) await createIndexes(req.db)
  return next()
}

const middleware = nextConnect()

middleware.use(database)

export default middleware