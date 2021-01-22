import nextConnect from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const bin = await req.db
    .collection('bins')
    .findOne({uuid: uuid})

  res.json(bin)
})

export default handler