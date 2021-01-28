import db from '@db/firebase'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid },
  } = req

  const foundItems = []
  await db
    .collection('prototypes')
    .where('image_uuid', '==', uuid)
    .get()
    .then(results => {
      results.forEach(result => {
        foundItems.push(result.data())
      })
    })

  await db
    .collection('bins')
    .where('image_uuid', '==', uuid)
    .get()
    .then(results => {
      results.forEach(result => {
        foundItems.push(result.data())
      })
    })

  if (foundItems.length > 0) {
    res.status(201).json({'in_use': true})
  } else {
    res.status(401).json({'in_use': false})
  }
})

export default handler