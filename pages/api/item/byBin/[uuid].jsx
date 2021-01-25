import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const items = await req.db
    .collection('items')
    .find({ bin_uuid: uuid })
    .toArray()

  const prototypes = await req.db
    .collection('prototypes')
    .find()
    .toArray()

  let prototype_names = []

  items.map(item => {
    if (item.in_bin && item.bin_uuid == uuid) {
      prototypes.forEach(prototype => {
        if (prototype.uuid == item.prototype_uuid) {
          item.prototype_name = prototype.name
          prototype_names.push(prototype.name)
          return
        }
      })
    }
  })

  let count = {}
  prototype_names.forEach(function(i) { count[i] = (count[i] || 0 ) + 1})
  let outputArr = []
  for (const [key, value] of Object.entries(count)) {
    outputArr.push(`${key} | ${value}`)
  }

  if (items) {
    res.status(201).json(outputArr)
  } else {
    res.status(401).send(`error finding items with bin uuid ${uuid}`)
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const items = await req.db
    .collection('items')
    .deleteMany({ bin_uuid: uuid })

  if (items) {
    res.status(201).json(items)
  } else {
    res.status(401).send(`error deleting items with bin uuid ${uuid}`)
  }
})

export default handler