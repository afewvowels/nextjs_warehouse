import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const prototype = await req.db
    .collection('prototypes')
    .findOne({ uuid: uuid })

  if (prototype) {
    res.status(201).json(prototype)
  } else {
    res.status(401).send(`error finding prototype with uuid ${uuid}`)
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const prototype = await req.db
    .collection('prototypes')
    .findOneAndDelete({ uuid: uuid })
    
  if (prototype) {
    res.status(201).json(prototype)
  } else {
    res.status(401).send(`error deleting prototype with uuid ${uuid}`)
  }
})

export default handler