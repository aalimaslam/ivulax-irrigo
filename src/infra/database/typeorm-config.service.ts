import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('DATABASE_TYPE'),
      url: this.configService.get<string>('DATABASE_URL'),
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT') || 5432,
      username: this.configService.get<string>('POSTGRES_USERNAME') ?? 'postgres',
      password: this.configService.get<string>('POSTGRES_PASSWORD') ?? 'postgres',
      database: this.configService.get<string>('POSTGRES_DB') ?? 'defaultdb',
      synchronize: this.configService.get<string>('DATABASE_SYNCHRONIZE') === 'true',
      dropSchema: false,
      keepConnectionAlive: true,
      logging: true,
      autoLoadEntities: true,
      poolSize: this.configService.get<number>('DATABASE_POOL_SIZE'),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: '../',
        migrationsDir: 'src/infra/database/migrations/',
        subscribersDir: 'subscriber',
      },
      extra: {
        max: this.configService.get<number>('DATABASE_MAX_CONNECTIONS') || 100,
        ssl:
          this.configService.get<string>('DATABASE_SSL_ENABLED') === 'true'
            ? {
                rejectUnauthorized:
                  this.configService.get<string>('DATABASE_REJECT_UNAUTHORIZED') === 'true',
                ca: this.configService.get<string>('DATABASE_CA') ?? undefined,
                key: this.configService.get<string>('DATABASE_KEY') ?? undefined,
                cert: this.configService.get<string>('DATABASE_CERT') ?? undefined,
              }
            : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
