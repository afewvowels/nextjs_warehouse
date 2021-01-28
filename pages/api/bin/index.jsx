import db from '@db/firebase'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
  await db
    .collection('bins')
    .orderBy('name')
    .get()
    .then((bins) => {
      let binsArr = []
      bins.forEach(bin => {
        binsArr.push(bin.data())
      })
      res.status(201).json(binsArr)
    })
    .catch((err) => res.status(401).send(`error getting bins ${err.message}`))
})

handler.post(async (req, res) => {
  const bin = {
    uuid: req.body.uuid,
    readable_name: req.body.readable_name,
    name: req.body.name,
    description: req.body.description,
    item_uuids: req.body.item_uuids,
    icon: req.body.icon,
    image_uuid: req.body.image_uuid,
    tinyurl: req.body.tinyurl
  }

  await db
    .collection('bins')
    .doc(bin.uuid)
    .set(bin)
    .then(() => res.status(201).send(`successfully added bin ${bin.readable_name}`))
    .catch((err) => res.status(401).send(`error adding bin ${bin.readable_name} ${err.message}`))
})

export default handler