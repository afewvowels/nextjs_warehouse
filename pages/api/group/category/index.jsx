import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  await db
    .collection('categories')
    .orderBy('name')
    .get()
    .then((categories) => {
      let categoriesArr = []
      categories.forEach(category => {
        categoriesArr.push(category.data())
      })
      res.status(201).json(categoriesArr)
    })
    .catch((err) => res.status(401).send(`error getting categories ${err.message}`))
})

handler.post(async (req, res) => {  
  const category = {
    uuid: req.body.uuid,
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon
  }

  await db
    .collection('categories')
    .doc(category.uuid)
    .set(category)
    .then(() => res.status(201).send(`successfully added category ${category.uuid}`))
    .catch((err) => res.status(401).send(`error adding category ${err.message}`))
})

export default handler