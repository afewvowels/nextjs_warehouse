import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const items = await req.db
    .collection('items')
    .aggregate([
    { $match: { bin_uuid: uuid} }])

  if (items) {
    res.status(201).json(items)
  } else {
    res.status(401).json({'error': `error deleting items with bin uuid ${uuid}`})
  }

})

export default handler