import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const fonts = await req.db
    .collection('fonts')
    .find()
    .toArray()

  if (fonts) {
    res.status(201).json(fonts)
  } else {
    res.status(401).send(`error getting fonts`)
  }
})

handler.post(async (req, res) => {
  const { uuid, name, link, css, category, weight0, weight1 } = req.body

  const font = await req.db
    .collection('fonts')
    .insertOne({ uuid, name, link, css, category, weight0, weight1 })
    .then(({ops}) => ops[0])

    if (font) {
      res.status(201).json(font)
    } else {
      res.status(401).send(`error inserting new font`)
    }
})

export default handler