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

handler.post(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const update = {
    $set: {
      uuid: req.body.uuid,
      readable_name: req.body.readable_name,
      name: req.body.name,
      description: req.body.description,
      traits: req.body.traits,
      icon: req.body.icon,
      image_uuid: req.body.image_uuid,
      category_uuid: req.body.category_uuid,
      tag_uuids: req.body.tag_uuids
    }
  }

  const prototype = await req.db
    .collection('prototypes')
    .findOneAndUpdate({ uuid: uuid }, update)

  if (prototype) {
    res.status(201).json(prototype)
  } else {
    res.status(401).send(`error updating prototype ${uuid}`)
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