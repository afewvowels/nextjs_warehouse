import nc from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nc()

handler.use(middleware)

handler.get(async (req, res) => {
  const images = await req.db
    .collection('images')
    .find()
    .toArray()

  let imgArr = []

  images.forEach(imageObj => {
    imgArr.push({
      _id: imageObj._id,
      uuid: imageObj.uuid
    })
  })

  res.json(imgArr)
})

export default handler