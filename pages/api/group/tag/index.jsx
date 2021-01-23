import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const tags = await req.db
    .collection('tags')
    .find()
    .toArray()

  res.json(tags)
})

handler.post(async (req, res) => {
  const { uuid, category_uuid, name, description, icon } = req.body

  const tag = await req.db
    .collection('tags')
    .insertOne({ uuid, category_uuid, name, description, icon })
    .then(({ops}) => ops[0])

  if (tag) {
    res.status(201).json(tag)
  } else {
    res.status(400).send(`error adding tag ${name}`)
  }
})

export default handler