import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './core/exception-filters/global-exception-filter';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle(configService.get('app.appName'))
    .setDescription(`The ${configService.get('app.appName')} API description`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
   const usersService = app.get(UsersService);
  await usersService.seedAdmin('admin@admin.com', 'admin@8082');
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
