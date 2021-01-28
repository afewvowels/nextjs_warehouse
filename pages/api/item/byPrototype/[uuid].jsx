import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('items')
    .where('prototype_uuid', '==', uuid)
    .orderBy('name')
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

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  await req.db
    .collection('items')
    .where('prototype_uuid', '==', uuid)
    .orderBy('name')
    .delete()
    .then(() => res.status(201).send(`successfully deleted all items with prototype_uuid ${uuid}`))
    .catch(err => res.status(401).send(`error deleting items with prototype_uuid ${uuid} ${err.message}`))
})

export default handler