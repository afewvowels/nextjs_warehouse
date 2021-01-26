import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const items = await req.db
    .collection('items')
    .find({ prototype_uuid: uuid })
    .toArray()

  if (items) {
    res.status(201).json(items)
  } else {
    res.status(401).json({'error': `error finding items with prototype_uuid ${uuid}`})
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const items = await req.db
    .collection('items')
    .deleteMany({ prototype_uuid: uuid })
    .then(({ops}) => ops[0])

  if (items) {
    res.status(201).json(items)
  } else {
    res.status(401).json({'error': `error deleting items with prototype_uuid ${uuid}`})
  }
})

export default handler