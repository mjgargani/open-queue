import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

const initializeQueue = async () => {
  const start = parseInt(process.env.QUEUE_START || '1', 10);
  const end = parseInt(process.env.QUEUE_END || '10000', 10);

  if (isNaN(start) || isNaN(end) || start > end) {
    console.error(`Invalid QUEUE_START (${start}) or QUEUE_END (${end}) values.`);
    return;
  }

  try {
    console.log('Initializing Redis queue...');
    await redis.flushall();
    const people = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    await redis.rpush('queue', ...people);
    console.log(`Queue initialized with numbers from ${start} to ${end}.`);
  } catch (error) {
    console.error('Error initializing Redis queue:', error);
  }
};

redis.on('connect', async () => {
  console.log('Connected to Redis.');
  await initializeQueue();
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redis;
