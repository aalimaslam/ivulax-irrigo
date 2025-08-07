import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { InfraModule } from './infra/infra.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config'; 

// @Module({
//   imports: [CoreModule, InfraModule, AuthModule, UsersModule],
//   controllers: [AppController],
//   providers: [AppService],
// })


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule, 
    InfraModule, 
    AuthModule, 
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
