import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  await db
    .collection('palettes')
    .where('uuid', '==', uuid)
    .get()
    .then((palettes) => {
      let palettesArr = []
      palettes.forEach(palette => {
        palettesArr.push(palette.data())
      })
      res.status(201).json(palettesArr[0])
    })
    .catch((err) => res.status(401).send(`error getting palettes ${err.message}`))
})

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req

  const palette = {
    uuid: req.body.uuid,
    hex0: req.body.hex0,
    hex1: req.body.hex1,
    color0: req.body.color0,
    color1: req.body.color1
  }

  await db
    .collection('palettes')
    .doc(uuid)
    .update(palette)
    .then(() => res.status(201).send(`successfully added pallete ${uuid}`))
    .catch((err) => res.status(401).send(`error adding palettes ${err.message}`))
})

handler.delete(async (req, res) => {
  const {
    query: { uuid },
  } = req

  await db
    .collection('palettes')
    .doc(uuid)
    .delete()
    .then(() => res.status(201).send(`successfully deleted palette ${uuid}`))
    .catch((err) => res.status(401).send(`error deleting palette ${uuid} ${err.message}`))
})

export default handler