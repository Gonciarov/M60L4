import { db } from '../../lib/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, content, timestamp } = req.body;
      if (!title || !content || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await addDoc(collection(db, 'entries'), {
        title,
        content,
        timestamp,
      });

      return res.status(200).json({ message: 'Entry saved' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save entry' });
    }
  } else if (req.method === 'GET') {
    try {
      const q = query(collection(db, 'entries'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ entries });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch entries' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}