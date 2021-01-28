import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('tags')
    .where('category_uuid', '==', uuid)
    .orderBy('name')
    .get()
    .then((tags) => {
      let tagsArr = []
      tags.forEach(tag => {
        tagsArr.push(tag.data())
      })
      res.status(201).json(tagsArr)
    })
    .catch((err) => res.status(401).send(`error getting tags with category uuid ${uuid} ${err.message}`))
})

export default handler