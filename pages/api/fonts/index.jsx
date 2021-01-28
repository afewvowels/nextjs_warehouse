import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  await db
    .collection('fonts')
    .orderBy('name')
    .get()
    .then((fonts) => {
      let fontsArr = []
      fonts.forEach(font => {
        fontsArr.push(font.data())
      })
      res.status(201).json(fontsArr)
    })
    .catch((err) => res.status(401).send(`error getting fonts ${err.message}`))
})

handler.post(async (req, res) => {
  const font = {
    uuid: req.body.uuid,
    name: req.body.name,
    link: req.body.link,
    css: req.body.css,
    category: req.body.category,
    weight0: req.body.weight0,
    weight1: req.body.weight1
  }

  await db
    .collection('fonts')
    .doc(font.uuid)
    .set(font)
    .then(() => res.status(201).send(`successfully added font ${font.uuid}`))
    .catch((err) => res.status(401).send(`error adding font ${err.message}`))
})

export default handler