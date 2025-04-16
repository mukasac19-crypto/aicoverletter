// lib/queues/openaiQueue.ts
import { Queue } from 'bullmq';
import redisConnection from '../redis.js';

export const openaiQueue = new Queue('openai-requests', {
  connection: redisConnection,
});
