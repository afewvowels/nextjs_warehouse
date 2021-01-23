import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const images = await req.db
    .collection('images')
    .find()
    .toArray()

  res.json(images)
})

handler.post(async (req, res) => {
  const { uuid, base64 }  = req.body

  console.log('image uuid: ' + uuid)
  console.log('image base64: ' + (base64.length > 10 ? 'true' : 'false'))

  const image = await req.db
    .collection('images')
    .insertOne({ uuid, base64 })
    .then(({ops}) => ops[0])

  if (image) {
    res.statusCode(201).send('added image successfully')
  } else {
    res.status(401).send('error adding image')
  }
})

export default handler