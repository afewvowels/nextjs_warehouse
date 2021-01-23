import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const prototypes = await req.db
    .collection('prototypes')
    .find()
    .toArray()
  
  if (prototypes) {
    res.status(201).json(prototypes)
  } else {
    res.status(401).send(`error finding prototypes`)
  }
})

handler.post(async (req, res) => {
  const { uuid, readable_name, name, description, traits, icon, image_uuid, category_uuid, tag_uuids } = req.body

  const prototype = await req.db
    .collection('prototypes')
    .insertOne({ uuid, readable_name, name, description, traits, icon, image_uuid, category_uuid, tag_uuids })
    .then(({ops}) => ops[0])

  if (prototype) {
    res.status(201).json(prototype)
  } else {
    res.status(401).send(`error creating prototype ${name}`)
  }
})

export default handler