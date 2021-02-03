import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('items')
    .where('uuid', '==', uuid)
    .get()
    .then((items) => {
      let itemsArr = []
      items.forEach(item => {
        itemsArr.push(item.data())
      })
      res.status(201).json(itemsArr[0])
    })
    .catch((err) => res.status(401).send(`error getting items ${err.message}`))
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const item = {
    uuid: req.body.uuid,
    prototype_uuid: req.body.prototype_uuid,
    bin_uuid: req.body.bin_uuid,
    in_bin: req.body.in_bin,
    notes: req.body.notes,
    tinyurl: req.body.tinyurl
  }

  await db
    .collection('items')
    .doc(item.uuid)
    .update(item)
    .then(() => res.status(201).send(`successfully added item ${uuid}`))
    .catch((err) => res.status(401).send(`error adding item ${err.message}`))
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  await db
    .collection('items')
    .doc(uuid)
    .delete()
    .then(() => res.status(201).send(`successfully deleted item ${uuid}`))
    .catch((err) => res.status(401).send(`error deleting item ${uuid} ${err.message}`))
})

export default handler