import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const category = await req.db
    .collection('categories')
    .findOne({ uuid: uuid })

  res.json(category)
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const category = await req.db
    .collection('categories')
    .findOneAndDelete({ uuid: uuid })

  if (category) {
    res.status(201).json(category)
  } else {
    res.status(401).send('error deleting category with uuid: ' + uuid)
  }
})

export default handler