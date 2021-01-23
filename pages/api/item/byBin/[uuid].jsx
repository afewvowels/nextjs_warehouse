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
    .find({ bin_uuid: uuid })
    .toArray()

  if (items) {
    res.status(201).json(items)
  } else {
    res.status(401).send(`error finding items with bin uuid ${uuid}`)
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const items = await req.db
    .collection('items')
    .deleteMany({ bin_uuid: uuid })

  if (items) {
    res.status(201).json(items)
  } else {
    res.status(401).send(`error deleting items with bin uuid ${uuid}`)
  }
})

export default handler