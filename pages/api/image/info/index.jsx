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
        let hasImage = false
        if (result.data().base64) {
          hasImage = true
        }
        images.push({
          _id: result.id,
          uuid: result.data().uuid,
          hasImage: hasImage
        })
      })
      res.status(201).json(images)
    })
    .catch(err => res.status(401).send(`error getting images info arr ${err.message}`))
})

export default handler