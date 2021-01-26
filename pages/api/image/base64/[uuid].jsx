import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()
handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  let outImg = { base64: null }

  const image = await req.db
    .collection('images')
    .findOne({ uuid: uuid })
  
  outImg.base64 = image.base64

  return image ? res.status(201).json(outImg) : res.status(404).json({'error': `error finding image with uuid ${uuid}`})
})

export default handler