import nextConnect from 'next-connect'
import middleware from '@middlewares/database'
import { getBins, insertBin } from '@db/bins'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const bins = await getBins(req.db)

  res.status(201).send({ bins })
})

handler.post(async (req, res) => {
  if (!req.body.content) return res.status(400).send(`POST request body was empty`)

  const bin = await insertBin(req.db, {
    content: req.body.content
  })

  return res.status(201).json({ bin })
})

export default handler