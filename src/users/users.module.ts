import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UserSubscriptionsModule } from '../user-subscriptions/user-subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    forwardRef(() => UserSubscriptionsModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}