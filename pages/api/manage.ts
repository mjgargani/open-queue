import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';
import { ACTIONS } from '../../lib/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, guiche } = req.body;

  if (!action || typeof action !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing action' });
  }

  if (!guiche || typeof guiche !== 'number') {
    return res.status(400).json({ error: 'Invalid or missing guiche' });
  }

  if (req.method === 'POST') {
    try {
      switch (action) {
        case ACTIONS.CALL_NEXT: {
          const next = await redis.lpop('queue');
          if (next) {
            await redis.set(`current:${guiche}`, JSON.stringify({ guiche, number: parseInt(next, 10) }));
            return res.status(200).json({ success: true });
          }
          return res.status(404).json({ error: 'Queue is empty' });
        }

        case ACTIONS.UNDO: {
          const currentKey = `current:${guiche}`;
          const current = await redis.get(currentKey);
          if (current) {
            const parsed = JSON.parse(current);
            await redis.lpush('queue', parsed.number);
            await redis.del(currentKey);
            return res.status(200).json({ success: true });
          }
          return res.status(400).json({ error: 'No current call to undo' });
        }

        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      console.error('Error in manage API:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
