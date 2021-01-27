import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('prototypes')
    .where('uuid', '==', uuid)
    .get()
    .then((prototypes) => {
      let prototypesArr = []
      prototypes.forEach(prototype => {
        prototypesArr.push(prototype.data())
      })
      res.status(201).json(prototypesArr[0])
    })
    .catch((err) => res.status(401).send(`error getting prototypes ${err.message}`))
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req
  
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
    .doc(uuid)
    .update(prototype)
    .then(() => res.status(201).send(`successfully added prototype ${uuid}`))
    .catch((err) => res.status(401).send(`error adding prototype ${err.message}`))
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  await db
    .collection('prototypes')
    .doc(uuid)
    .delete()
    .then(() => res.status(201).send(`successfully deleted prototype ${uuid}`))
    .catch((err) => res.status(401).send(`error deleting prototype ${uuid} ${err.message}`))
})

export default handler