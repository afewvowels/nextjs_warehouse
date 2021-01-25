import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.delete(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const item = await req.db
    .collection('items')
    .findOneAndDelete({ uuid: uuid })

  if (item) {
    res.status(201).json(item)
  } else {
    res.status(401).send(`error deleting item with uuid ${uuid}`)
  }
})

export default handler