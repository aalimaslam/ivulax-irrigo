import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { InfraModule } from './infra/infra.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UserSubscriptionsModule } from './user-subscriptions/user-subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { IrrigationModule } from './irrigation/irrigation.module';
import { TasksModule } from './tasks/tasks.module';

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
    UsersModule,
    SubscriptionsModule,
    UserSubscriptionsModule,
    PaymentsModule,
    TransactionsModule,
    IrrigationModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
