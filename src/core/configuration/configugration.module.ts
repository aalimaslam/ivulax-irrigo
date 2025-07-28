import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import adminConfiguration from './admin.configuration';
import appConfiguration from './app.configuration';
import multerConfiguration from './multer.configuration';
import cacheConfiguration from './cache.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        adminConfiguration,
        appConfiguration,
        multerConfiguration,
        cacheConfiguration,
      ],
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class ConfigurationModule {}
