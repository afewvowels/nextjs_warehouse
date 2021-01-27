import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('categories')
    .where('uuid', '==', uuid)
    .get()
    .then((categories) => {
      let categoriesArr = []
      categories.forEach(category => {
        categoriesArr.push(category.data())
      })
      res.status(201).json(categoriesArr[0])
    })
    .catch((err) => res.status(401).send(`error getting categories ${err.message}`))
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req
  
  const category = {
    uuid: req.body.uuid,
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon
  }

  await db
    .collection('categories')
    .doc(category.uuid)
    .update(category)
    .then(() => res.status(201).send(`successfully added category ${uuid}`))
    .catch((err) => res.status(401).send(`error adding category ${err.message}`))
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  await db
    .collection('categories')
    .doc(uuid)
    .delete()
    .then(() => res.status(201).send(`successfully deleted category ${uuid}`))
    .catch((err) => res.status(401).send(`error deleting category ${uuid} ${err.message}`))
})

export default handler