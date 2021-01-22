import nextConnect from 'next-connect'
import middleware from 'pages/api/bin/uuid/node_modules/@middlewares/middleware'
import { extractBin } from '@lib/api-helpers'
import { ObjectId } from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const bins = await req.db
    .collection('bins')
    .find()
    .toArray()

  res.json(bins)
})

handler.post(async (req, res) => {
  const { uuid, readable_name, name, description, item_uuids, icon  } = req.body

  console.log('bin body: ' + req.body)
  console.log('bin name: ' + req.body.name)
  console.log('bin description: ' + req.body.description)

  const bin = await req.db
    .collection('bins')
    .insertOne({ uuid, readable_name, name, description, item_uuids, icon })
    .then((ops) => ops[0])

  if (bin) res.status(201).json({ 'success': 'added bin successfully' })
})

export default handler