import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.get(async (req, res) => {
  const {
    query: { uuid }
  } = req

  let itemsArr = []
  await db
    .collection('items')
    .where('bin_uuid', '==', uuid)
    .get()
    .then((items) => {
      items.forEach(item => {
        itemsArr.push(item.data())
      })
    })
    .catch((err) => res.status(401).send(`error getting items by bin with bin_uuid ${uuid} ${err.message}`))

  let prototypesArr = []
  let prototypesNamesArr = []
  await db
    .collection('prototypes')
    .get()
    .then((prototypes) => {
      prototypes.forEach(prototype => {
        prototypesArr.push(prototype.data())
      })
    })
    .catch((err) => res.status(401).send(`error getting prototype names ${err.message}`))

  itemsArr.forEach(item => {
    if (item.in_bin && item.bin_uuid == uuid) {
      prototypesArr.forEach(prototype => {
        if (prototype.uuid == item.prototype_uuid) {
          prototypesNamesArr.push(prototype.name)
        }
      })
    }
  })

  let count = {}
  prototypesNamesArr.forEach(function(i) { count[i] = (count[i] || 0 ) + 1})
  let outputArr = []
  for (const [key, value] of Object.entries(count)) {
    outputArr.push(`${key} | ${value}`)
  }

  if (outputArr.length < 1) {
    outputArr.push('Bin is empty')
  }

  res.status(201).json(outputArr)
})

export default handler