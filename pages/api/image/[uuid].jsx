import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('images')
    .where('uuid', '==', uuid)
    .get()
    .then((images) => {
      let imagesArr = []
      images.forEach(image => {
        imagesArr.push(image.data())
      })
      res.status(201).json(imagesArr[0])
    })
    .catch((err) => res.status(401).send(`error getting images ${err.message}`))
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req
  
  const image = {
    uuid: req.body.uuid,
    base64: req.body.base64
  }

  await db
    .collection('images')
    .doc(image.uuid)
    .update(image)
    .then(() => res.status(201).send(`successfully added image ${uuid}`))
    .catch((err) => res.status(401).send(`error adding image ${err.message}`))
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  await db
    .collection('images')
    .doc(uuid)
    .delete()
    .then(() => res.status(201).send(`successfully deleted image ${uuid}`))
    .catch((err) => res.status(401).send(`error deleting image ${uuid} ${err.message}`))
})

export default handler