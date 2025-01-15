import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const current = await redis.get('current');
    const queue = await redis.lrange('queue', 0, -1);
    res.status(200).json({ current, queue });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
