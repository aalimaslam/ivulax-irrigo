import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  cachePort: parseInt(process.env.CACHE_PORT, 10),
  cacheHost: process.env.CACHE_HOST,
  cacheUsername: process.env.CACHE_USERNAME,
  cachePassword: process.env.CACHE_PASSWORD,
  cacheMaxConnections: parseInt(process.env.CACHE_MAX_CONNECTIONS, 10),
  cacheTTL: parseInt(process.env.CACHE_TTL, 10),
  cacheDatabase: 0,
}));
