import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<any>('DATABASE_TYPE'),
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      username: 'postgres',
      password: 'postgres',
      database: 'defaultdb',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true, // Should be false in production
      logging: true,
    } as TypeOrmModuleOptions;
  }
}
