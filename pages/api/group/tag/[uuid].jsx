import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('tags')
    .where('uuid', '==', uuid)
    .get()
    .then((tags) => {
      let tagsArr = []
      tags.forEach(tag => {
        tagsArr.push(tag.data())
      })
      res.status(201).json(tagsArr[0])
    })
    .catch((err) => res.status(401).send(`error getting tags ${err.message}`))
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req
  
  const tag = {
    category_uuid: req.body.category_uuid,
    uuid: req.body.uuid,
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon
  }

  await db
    .collection('tags')
    .doc(tag.uuid)
    .set(tag)
    .then(() => res.status(201).send(`successfully added tag ${uuid}`))
    .catch((err) => res.status(401).send(`error adding tag ${err.message}`))
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  await db
    .collection('tags')
    .doc(uuid)
    .delete()
    .then(() => res.status(201).send(`successfully deleted tag ${uuid}`))
    .catch((err) => res.status(401).send(`error deleting tag ${uuid} ${err.message}`))
})

export default handler