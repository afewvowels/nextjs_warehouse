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

  if (bin) {
    res.status(201).json(bin)
  } else {
    res.status(404).send(`error finding bin with uuid ${uuid}`)
  }
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const update = {
    $set: {
    uuid: req.body.uuid,
    readable_name: req.body.readable_name,
    name: req.body.name,
    description: req.body.description,
    item_uuids: req.body.item_uuids,
    icon: req.body.icon,
    image_uuid: req.body.image_uuid
  }}

  let bin = await req.db
    .collection('bins')
    .findOneAndUpdate({uuid: uuid}, update)
  
  if (bin) {
    res.status(201).json(bin)
  } else {
    res.status(401).send(`error updating bin with uuid ${uuid}`)
  }
})

handler.delete(async (req, res) => {
  const { 
    query: { uuid }
   } = req

  const bin = await req.db
    .collection('bins')
    .findOneAndDelete({ uuid: uuid })

  return (bin) ? res.status(201).json(bin) : res.status(404).send('bin not found')
})

export default handler