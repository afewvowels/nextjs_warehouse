import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const categories = await req.db
    .collection('categories')
    .find()
    .toArray()

  res.status(201).json(categories)
})

handler.post(async (req, res) => {
  const { uuid, name, description, icon } = req.body

  const category = await req.db
    .collection('categories')
    .insertOne({ uuid, name, description, icon })
    .then(({ops}) => ops[0])

  if (category) {
    res.status(201).json(category)
  } else {
    res.status(401).send('error adding category')
  }
})

export default handler