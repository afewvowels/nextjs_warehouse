import nc from 'next-connect'
import db from '@db/firebase'

const handler = nc()

handler.post(async (req, res) => {
  const {
    query: { uuid }
  } = req
  
  const update = {
    in_bin: req.body.in_bin
  }

  await db.collection('items')
    .doc(uuid)
    .update(update)
    .then(() => res.status(201).send(`successfully checked in/out item with uuid ${uuid}`))
    .catch((err) => res.status(401).send(`error checking item in/out with uuid ${uuid} ${err.message}`))
})

export default handler