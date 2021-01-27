import { MongoClient } from 'mongodb'
import nc from 'next-connect'

global.mongo = global.mongo || {}

let indexesCreated = false
export async function createIndexes(db) {
  await Promise.all([
    db.collection('bins').createIndex({ name: -1 }),
    db.collection('prototypes').createIndex({ name: -1 }),
    db.collection('items').createIndex({ name: -1 }),
    db.collection('categories').createIndex({ name: -1 }),
    db.collection('tags').createIndex({ name: -1 }),
    db.collection('images').createIndex({ name: -1 }),
    db.collection('palettes').createIndex({ _id: -1 }),
    db.collection('fonts').createIndex({ _id: -1 })
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

const middleware = nc()

middleware.use(database)

export default middleware