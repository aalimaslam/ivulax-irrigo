import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { DatabaseModule } from './database/database.module';
import { RedisCacheModule } from './cache/cache.module';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const destination = configService.get<string>('multer.multerDest');
        const maxFileSize = Number(
          configService.get<string>('multer.multerMaxFileSize'),
        );

        if (!destination) {
          throw new Error('MULTER_DEST environment variable is not set.');
        }

        return {
          limits: {
            fileSize: maxFileSize,
          },
          storage: diskStorage({
            destination: destination,
            filename: (req, file, cb) => {
              const prefix = Date.now() + '-' + uuidV4();
              const fileName =
                prefix + '-' + file.originalname.replace(/\s/g, '');
              cb(null, fileName);
            },
          }),
        };
      },
    }),
    RedisCacheModule,
  ],
  providers: [],
  exports: [MulterModule],
})
export class InfraModule {}
