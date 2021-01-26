import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const items = await req.db
    .collection('items')
    .find()
    .toArray()

  if (items) {
    res.status(201).json(items)
  } else {
    res.status(401).json({'error': `error getting items`})
  }
})

handler.post(async (req, res) => {
  const { uuid, prototype_uuid, bin_uuid, in_bin } = req.body

  const item = await req.db
    .collection('items')
    .insertOne({ uuid, prototype_uuid, bin_uuid, in_bin })
    .then(({ops}) => ops[0])

  if (item) {
    res.status(201).json(item)
  } else {
    res.status(401).json({'error': `error creating item with uuid ${uuid}`})
  }
})

export default handler