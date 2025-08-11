import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UserSubscriptionsModule } from '../user-subscriptions/user-subscriptions.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    SubscriptionsModule,
    UserSubscriptionsModule,
    ConfigModule,
    AuthModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
