import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const image = await req.db
    .collection('images')
    .findOne({ uuid: uuid })

  return image ? res.status(201).json(image) : res.status(404).send(`error finding image with uuid: ${uuid}`)
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const update = {
    $set: {
    uuid: req.body.uuid,
    base64: req.body.base64
    }
  }

  const image = await req.db
    .collection('images')
    .findOneAndUpdate({uuid: uuid}, update)
  
  return image ? res.status(201).json(image) : res.status(404).send(`error updating image with uuid: ${uuid}`)
})

handler.delete(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const image = await req.db
    .collection('images')
    .findOneAndDelete({ uuid: uuid })

  return image ? res.status(201).json(image) : res.status(404).send(`error deleting image with uuid: ${uuid}`)
})

export default handler