import { QueueResponse } from '@/types';

export const fetchQueueData = async (): Promise<QueueResponse> => {
  const res = await fetch('/api/queue');

  if (!res.ok) {
    throw new Error('Failed to fetch queue data');
  }

  const data: QueueResponse = await res.json();
  return data;
};
