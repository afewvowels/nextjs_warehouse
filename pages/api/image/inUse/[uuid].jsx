import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const prototypes = await req.db
    .collection('prototypes')
    .find({image_uuid: uuid})
    .toArray()

  const bins = await req.db
    .collection('bins')
    .find({image_uuid: uuid})
    .toArray()

  if (prototypes.length > 0 || bins.length > 0) {
    res.status(201).json({'in_use': true})
  } else {
    res.status(401).json({'in_use': false})
  }
})

export default handler