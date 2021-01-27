import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  await db
    .collection('images')
    .get()
    .then((images) => {
      let imagesArr = []
      images.forEach(image => {
        imagesArr.push(image.data())
      })
      res.status(201).json(imagesArr)
    })
    .catch((err) => res.status(401).send(`error getting images ${err.message}`))
})

handler.post(async (req, res) => {
  const image = {
    uuid: req.body.uuid,
    base64: req.body.base64
  }

  await db
    .collection('images')
    .doc(image.uuid)
    .set(image)
    .then(() => res.status(201).send(`successfully added image ${image.uuid}`))
    .catch((err) => res.status(401).send(`error adding image ${err.message}`))
})

export default handler