import { connectToDatabase } from 'db/mongodb'
import bins from 'pages/api/bins'
import { v4 as uuidv4 } from 'uuid'
const readable = require('readable-url-names')

var generator = new readable()

export async function findByUuid(db, uuid) {
  return db.collection('images').findOne({ uuid: uuid })
    .then((image) => image || null)
}

export async function insertImage(db, {
  base64, bin, prototype
}) {
  return db
    .collection('images')
    .insertOne({
      uuid: uuidv4(),
      readable_name: generator.generate(),
      bins: [bin],
      prototypes: [...prototype],
      base64
    })
    .then(({ ops }) => ops[0])
}