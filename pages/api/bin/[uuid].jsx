import firebase from '@lib/firebase'

export default async (req, res) => {
  const {
    query: { uuid }
  } = req

  if (req.method == 'GET') {
    await firebase
      .collection('bins')
      .where('uuid', '==', uuid)
      .get()
      .then((bins) => {
        let returnArr = []
        bins.forEach(bin => {
          returnArr.push(bin.data())
        })
        res.status(201).json(returnArr)
      })
      .catch((err) => res.status(401).json(err))
  } else if (req.method == 'POST') {
    await firebase
      .collection('bins')
      .add(req.body)
      .then(() => {
        res.status(201).json({success: 'created bin successfully'})
      })
      .catch((err) => res.status(401).json(err))
  }
}