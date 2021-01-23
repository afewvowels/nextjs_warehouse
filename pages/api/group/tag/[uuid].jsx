import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const tag = await req.db
    .collection('tags')
    .findOne({ uuid: uuid })

  res.json(tag)
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const tag = await req.db
    .collection('tags')
    .findOneAndDelete({ uuid: uuid })

  if (tag) {
    res.status(201).json(tag)
  } else {
    res.status(401).send(`error deleting tag with uuid ${uuid}`)
  }
})

export default handler