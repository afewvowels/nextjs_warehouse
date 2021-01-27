import db from '@db/firebase'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req
  
  await db
    .collection('images')
    .where('uuid', '==', uuid)
    .get()
    .then(results => {
      let resArr = []
      results.forEach(result => {
        resArr.push(result.data().base64)
      })
      res.status(201).json({'base64': resArr[0]})
    })
    .catch(err => res.status(401).send(`error getting image base64 for image with uuid ${uuid} ${err.message}`))
})

export default handler