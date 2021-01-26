import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const palettes = await req.db
    .collection('palettes')
    .find()
    .toArray()

  if (palettes) {
    res.status(201).json(palettes)
  } else {
    res.status(401).json({'error': `error finding palettes`})
  }
})

handler.post(async (req, res) => {
  const { uuid, hex0, hex1, color0, color1 } = req.body

  const palette = await req.db
    .collection('palettes')
    .insertOne({ uuid, hex0, hex1, color0, color1 })
    .then(({ops}) => ops[0])

    if (palette) {
      res.status(201).json(palette)
    } else {
      res.status(401).json({'error': `error inserting new palette`})
    }
})

export default handler