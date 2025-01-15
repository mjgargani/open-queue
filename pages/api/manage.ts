import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, guiche } = req.body;

  if (req.method === 'POST') {
    switch (action) {
      case 'call-next': {
        const next = await redis.lpop('queue');
        if (next) {
          await redis.set('current', JSON.stringify({ guiche, number: next }));
          res.status(200).json({ success: true, current: { guiche, number: next } });
        } else {
          res.status(404).json({ error: 'Queue is empty' });
        }
        break;
      }
      case 'undo': {
        const current = JSON.parse(await redis.get('current') || '{}');
        if (current.number) {
          await redis.rpush('queue', current.number);
          await redis.del('current');
          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ error: 'No current call to undo' });
        }
        break;
      }
      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
