import { Module } from '@nestjs/common';
// import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('cache.cacheHost');
        const port = configService.get('cache.cachePort');
        const ttl = parseInt(configService.get('cache.cacheTTL'), 10) || 12000;
        const username = configService.get('cache.cacheUsername');
        const password = configService.get('cache.cachePassword');
        const database = configService.get('cache.cacheDatabase');

        if (isNaN(ttl)) throw new Error('Ttl needs to be a number ' + ttl);
        if (!host || !port || !ttl || !username || !password) {
          throw new Error('Redis configuration is missing!');
        }

        const store = await redisStore({
          socket: {
            host,
            port,
          },
          database,
          username,
          password,
        });
        return {
          store: store as CacheStore,
          ttl,
        };
      },
    }),
  ],
  controllers: [CacheController],
  providers: [CacheService],
})
export class RedisCacheModule {}
