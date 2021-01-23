import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

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

handler.delete(async (req, res) => {
  const { 
    query: { uuid }
   } = req

  const bin = await req.db
    .collection('bins')
    .findOneAndDelete({uuid: uuid})

  return (bin) ? res.json(bin) : res.status(404).send('bin not found')
})

export default handler