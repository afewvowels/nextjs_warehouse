import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  await db
    .collection('prototypes')
    .orderBy('name')
    .get()
    .then((prototypes) => {
      let prototypesArr = []
      prototypes.forEach(prototype => {
        prototypesArr.push(prototype.data())
      })
      res.status(201).json(prototypesArr)
    })
    .catch((err) => res.status(401).send(`error getting prototypes ${err.message}`))
})

handler.post(async (req, res) => {
  const prototype = {
    uuid: req.body.uuid,
    readable_name: req.body.readable_name,
    name: req.body.name,
    description: req.body.description,
    traits: req.body.traits,
    icon: req.body.icon,
    image_uuid: req.body.image_uuid,
    category_uuid: req.body.category_uuid,
    tag_uuids: req.body.tag_uuids
  }

  await db
    .collection('prototypes')
    .doc(prototype.uuid)
    .set(prototype)
    .then(() => res.status(201).send(`successfully added prototype ${prototype.uuid}`))
    .catch((err) => res.status(401).send(`error adding prototype ${err.message}`))
})

export default handler