import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  await db
    .collection('items')
    .get()
    .then((items) => {
      let itemsArr = []
      items.forEach(item => {
        itemsArr.push(item.data())
      })
      res.status(201).json(itemsArr)
    })
    .catch((err) => res.status(401).send(`error getting items ${err.message}`))
})

handler.post(async (req, res) => {
  const item = {
    uuid: req.body.uuid,
    prototype_uuid: req.body.prototype_uuid,
    bin_uuid: req.body.bin_uuid,
    in_bin: req.body.in_bin
  }

  await db
    .collection('items')
    .doc(item.uuid)
    .set(item)
    .then(() => res.status(201).send(`successfully added item ${item.uuid}`))
    .catch((err) => res.status(401).send(`error adding item ${err.message}`))
})

export default handler