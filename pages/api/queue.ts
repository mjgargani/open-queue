import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';
import { CurrentState } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const currentKeys = await redis.keys('current:*');
      const currentStates: CurrentState[] = await Promise.all(
        currentKeys.map(async (key) => {
          const state = await redis.get(key);
          return state ? JSON.parse(state) : null;
        })
      ).then((states) => states.filter((state): state is CurrentState => state !== null));

      const finalized = await redis.lrange('finalized', 0, -1);
      const queue = await redis.lrange('queue', 0, -1).then((nums) => nums.map(Number));

      const finalizedWithoutCurrent = finalized.filter(
        (num) => !currentStates.find((state) => state.number === parseInt(num, 10))
      );

      res.status(200).json({ success: true, currentStates, finalized: finalizedWithoutCurrent, queue });
    } catch (error) {
      console.error('Error fetching queue state:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
