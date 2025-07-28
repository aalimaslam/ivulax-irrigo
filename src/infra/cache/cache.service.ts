// import { Inject, Injectable } from '@nestjs/common';

import { Injectable } from "@nestjs/common";

// import { SetItemOptions } from './cache.type';
// import { LoggerService } from '../../core/logger/logger.service';
// import { Cache } from 'cache-manager';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';

// @Injectable()
// export class CacheService {
//   logger = new LoggerService(CacheService.name);
  
//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

//   async getItem(key: string): Promise<any> {
//     try {
//       return await this.cacheManager.get(key);
//     } catch (err) {
//       this.logger.error(`Error in getItem : ${err}`);
//       throw err;
//     }
//   }

//   async setItem(
//     key: string,
//     value: any,
//     options?: SetItemOptions,
//   ): Promise<boolean> {
//     try {
//       return await this.cacheManager.set(key, value, options.ttl);
//     } catch (err) {
//       this.logger.error(`Error in setItem : ${err}`);
//       throw err;
//     }
//   }

//   async deleteItem(key: string): Promise<boolean> {
//     try {
//       return await this.cacheManager.del(key);
//     } catch (err) {
//       this.logger.error(`Error in deleteItem : ${err}`);
//       throw err;
//     }
//   }
// }


@Injectable()
export class CacheService{

}