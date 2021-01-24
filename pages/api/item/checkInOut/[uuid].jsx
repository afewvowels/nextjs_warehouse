import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const update = {
    $set: {
      in_bin: req.body.in_bin
    }
  }

  const item = await req.db
    .collection('items')
    .findOneAndUpdate({uuid: uuid}, update)

  if (item) {
    res.status(201).json(item)
  } else {
    res.status(401).send(`error updating item with uuid ${uuid}`)
  }
})

export default handler