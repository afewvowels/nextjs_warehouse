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

  if (category) {
    res.status(201).json(category)
  } else {
    res.status(401).send('error updating category with uuid ' + uuid)
  }
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const update = {
    $set: {
    uuid: req.body.uuid,
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon
    }
  }

  let category = await req.db
    .collection('categories')
    .findOneAndUpdate({ uuid: uuid }, update)

  if (category) {
    res.status(201).json(category)
  } else {
    res.status(401).send('error updating category with uuid ' + uuid)
  }
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
    res.status(401).json({'error': 'error deleting category with uuid: ' + uuid})
  }
})

export default handler