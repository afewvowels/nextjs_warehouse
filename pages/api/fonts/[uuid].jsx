import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const font = await req.db
    .collection('fonts')
    .findOne({ uuid: uuid })

  if (font) {
    res.status(201).json(font)
  } else {
    res.status(404).send(`error finding font with uuid ${uuid}`)
  }
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const update = {
    $set: {
      uuid: req.body.uuid,
      name: req.body.name,
      link: req.body.link,
      css: req.body.css,
      category: req.body.category,
      weight0: req.body.weight0,
      weight1: req.body.weight1
    }
  }

  let font = await req.db
    .collection('fonts')
    .findOneAndUpdate({uuid: uuid}, update)

  if (font) {
    res.status(201).json(font)
  } else {
    res.status(404).send(`error updating font with uuid ${uuid}`)
  }
})

handler.delete(async (req, res) => {
  const {
    query: { uuid }
  } = req

  let font = await req.db
    .collection('fonts')
    .findOneAndDelete({uuid: uuid})

  if (font) {
    res.status(201).json(font)
  } else {
    res.status(404).send(`error deleting font with uuid ${uuid}`)
  }
})

export default handler