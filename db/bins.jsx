import { v4 as uuidv4 } from 'uuid'
const readable = require("readable-url-names");

var generator = new readable()

export async function getBins(db) {
  return db
    .collection('bins')
    .find({})
    .toArray()
}

export async function findByUuid(db, uuid) {
  return db.collection('bins').findOne({ uuid: uuid})
    .then((bin) => bin || null)
}

export async function insertBin(db, {
  name, description, item_uuids, image_uuid, icon
}) {
  return db
    .collection('bins')
    .insertOne({
      uuid: uuidv4(),
      readable_name: generator.generate(),
      name,
      description,
      item_uuids: [...item_uuids],
      image_uuid,
      icon
    })
    .then(({ ops }) => ops[0])
}