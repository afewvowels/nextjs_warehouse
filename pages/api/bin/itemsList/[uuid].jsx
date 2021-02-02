import db from '@db/firebase'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('items')
    .where('bin_uuid', '==', uuid)
    .get()
    .then((items) => {
      let itemsArr = []
      items.forEach((item) => {
        itemsArr.push(item.data())
      })
      res.status(201).json(itemsArr)
    })
    .catch((err) => res.status(401).send(`error getting items ${err.message}`))
})

export default handler