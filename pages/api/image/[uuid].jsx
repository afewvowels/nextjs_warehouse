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

handler.delete(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const image = await req.db
    .collection('images')
    .findOneAndDelete({ uuid: uuid })

  return image ? res.json(image) : res.status(404).send(`error deleting image with uuid: ${uuid}`)
})

export default handler