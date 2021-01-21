import { connectToDatabase } from 'util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const bins = await db
    .collection('bins')
    .find({})
    .toArray();

  res.json(bins);
}