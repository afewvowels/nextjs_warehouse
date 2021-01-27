import db from '@db/firebase'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
  const images = []
  await db
    .collection('images')
    .get()
    .then(results => {
      results.forEach(result => {
        images.push({
          _id: result.id,
          uuid: result.data().uuid
        })
      })
      res.status(201).json(images)
    })
    .catch(err => res.status(401).send(`error getting images info arr ${err.message}`))
})

export default handler