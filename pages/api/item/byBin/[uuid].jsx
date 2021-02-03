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
  let prototypesNamesTotalArr = []

  await db
    .collection('prototypes')
    .orderBy('name')
    .get()
    .then((prototypes) => {
      prototypes.forEach(prototype => {
        prototypesArr.push(prototype.data())
      })
    })
    .catch((err) => res.status(401).send(`error getting prototype names ${err.message}`))

  itemsArr.forEach(item => {
    prototypesArr.forEach(prototype => {
      if (item.prototype_uuid == prototype.uuid) {
        prototypesNamesTotalArr.push(prototype.name)
        if (item.in_bin) {
          prototypesNamesArr.push(prototype.name)
        }
        return
      }
    })
  })

  let count = {}
  prototypesNamesArr.forEach(function(i) {
    count[i] = (count[i] || 0 ) + 1
  })

  let countAll = {}
  prototypesNamesTotalArr.forEach(function(i) {
    countAll[i] = (countAll[i] || 0 ) + 1
  })

  let outputArr = []
  for (const [key, value] of Object.entries(countAll)) {
    let inBin

    if (count[key]) {
      inBin = count[key]
    } else {
      inBin = 0
    }

    outputArr.push([`${key}`, `${inBin}`, `${value}`])
  }

  if (outputArr.length < 1) {
    outputArr.push('Bin is empty')
  }

  res.status(201).json(outputArr)
})

export default handler