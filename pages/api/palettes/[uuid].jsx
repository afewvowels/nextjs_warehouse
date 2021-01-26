import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const palette = await req.db
    .collection('palettes')
    .findOne({ uuid: uuid })

  if (palette) {
    res.status(201).json(palette)
  } else {
    res.status(404).send(`error finding palette with uuid ${uuid}`)
  }
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const update = {
    $set: {
      uuid: req.body.uuid,
      hex0: req.body.hex0,
      hex1: req.body.hex1,
      color0: req.body.color0,
      color1: req.body.color1
    }
  }

  let palette = await req.db
    .collection('palettes')
    .findOneAndUpdate({uuid: uuid}, update)

  if (palette) {
    res.status(201).json(palette)
  } else {
    res.status(404).send(`error updating palette with uuid ${uuid}`)
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid }
  } = req

  let palette = await req.db
    .collection('palettes')
    .findOneAndDelete({uuid: uuid})

  if (palette) {
    res.status(201).json(palette)
  } else {
    res.status(404).send(`error deleting palette with uuid ${uuid}`)
  }
})

export default handler