import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const images = await req.db
    .collection('images')
    .find()
    .toArray()

  if (images) {
    res.status(201).json(images)
  } else {
    res.status(401).json({'error': 'error getting images'})
  }
})

handler.post(async (req, res) => {
  const { uuid, base64 }  = req.body

  const image = await req.db
    .collection('images')
    .insertOne({ uuid, base64 })
    .then(({ops}) => ops[0])

  if (image) {
    res.status(201).json({'success': 'added image successfully'})
  } else {
    res.status(401).json({'error': 'error adding image'})
  }
})

export default handler

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5120kb',
    },
  },
}