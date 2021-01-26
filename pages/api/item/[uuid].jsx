import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const item = await req.db 
    .collection('items')
    .findOne({ uuid: uuid })

  if (item) {
    res.status(201).json(item)
  } else {
    res.status(404).json({'error': `error finding item with uuid ${uuid}`})
  }
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const update = {
    $set: {
    uuid: req.body.uuid,
    prototype_uuid: req.body.prototype_uuid,
    bin_uuid: req.body.bin_uuid,
    in_bin: req.body.in_bin
    }
  }

  const item = await req.db
    .collection('items')
    .findOneAndUpdate({uuid: uuid}, update)

  if (item) {
    res.status(201).json(item)
  } else {
    res.status(401).json({'error': `error updating item with uuid ${uuid}`})
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const item = await req.db
    .collection('items')
    .findOneAndDelete({ uuid: uuid })

  if (item) {
    res.status(201).json(item)
  } else {
    res.status(401).json({'error': `error deleting item with uuid ${uuid}`})
  }
})

export default handler