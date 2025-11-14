import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

console.log('=== REDIS DEBUG INFO ===');
console.log('REDIS_URL:', redisUrl);
console.log('Process ENV keys:', Object.keys(process.env).filter(k => k.includes('REDIS')));
console.log('========================');

if (!redisUrl) {
  throw new Error('REDIS_URL is not set in environment variables.');
}

const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,

  // === FIXES APPLIED BELOW ===

  // 1. REMOVED `lazyConnect: true`.
  // This ensures the connection is established on startup, which is more reliable for workers.

  // 2. REMOVED `enableOfflineQueue: false`.
  // The default (`true`) is REQUIRED for BullMQ to handle reconnects gracefully.
  // This will queue commands during a reconnect instead of failing them.
  // This is the most important fix for the ECONNRESET loop.

  // 3. Lowered timeouts. 60s is too long for Upstash and can hide problems.
  // 10s is more than enough.
  connectTimeout: 10000, // 10 seconds
  commandTimeout: 10000, // 10 seconds

  // Your keepAlive setting is good. This tells the OS to send a packet
  // every 30s to keep NAT gateways from closing the idle connection.
  keepAlive: 30000, // 30 seconds
  family: 4,

  // Your retry strategy is fine
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },

  // Your reconnect settings are perfect
  reconnectOnError: (err) => {
    const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
    return targetErrors.some(target => err.message.includes(target));
  },
});

redisConnection.on('connect', () => {
  console.log('Successfully connected to Redis (Upstash).');
});

redisConnection.on('error', (err) => {
  // Filter command timeout noise but log other errors
  if (err.message?.includes('Command timed out')) {
    console.log('Redis command timeout (retrying...)');
    return;
  }
  console.error('Redis Connection Error:', err);
});

redisConnection.on('close', () => {
  console.log('Redis connection closed.');
});

redisConnection.on('reconnecting', () => {
  console.log('Redis reconnecting...');
});

export default redisConnection;