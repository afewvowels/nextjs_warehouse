import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const bin = await req.db
    .collection('bins')
    .findOne({uuid: uuid})

  if (bin) {
    res.status(201).json(bin)
  } else {
    res.status(404).send(`error finding bin with uuid ${uuid}`)
  }
})