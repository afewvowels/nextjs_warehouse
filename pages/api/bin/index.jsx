import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const bins = await req.db
    .collection('bins')
    .find()
    .toArray()

  if (bins) {
    res.status(201).json(bins)
  } else {
    res.status(401).json({'error': 'error getting bins'})
  }
})

handler.post(async (req, res) => {
  const { uuid, readable_name, name, description, item_uuids, icon, image_uuid  } = req.body

  const bin = await req.db
    .collection('bins')
    .insertOne({ uuid, readable_name, name, description, item_uuids, icon, image_uuid })
    .then(({ops}) => ops[0])

  if (bin) {
    res.status(201).json({ bin: bin })
  } else {
    res.status(401).json({'error': 'error adding bin'})
  }
})

export default handler