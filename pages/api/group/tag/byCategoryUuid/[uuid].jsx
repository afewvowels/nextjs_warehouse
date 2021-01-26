import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) =>{
  const {
    query: { uuid },
  } = req

  const tags = await req.db
    .collection('tags')
    .find({ category_uuid: uuid })
    .then(({ops}) => ops[0])
  
  if (tags) {
    res.status(201).json(tags)
  } else {
    res.status(401).json({'error': `error finding tags by category uuid ${uuid}`})
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req
  
  const tags = await req.db
    .collection('tags')
    .deleteMany({ category_uuid: uuid })

  if (tags) {
    res.status(201).json(tags)
  } else {
    res.status(401).json({'error': `error deleting tags by category uuid ${uuid}`})
  }
})

export default handler