import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscription)
    private userSubscriptionsRepository: Repository<UserSubscription>,
    private usersService: UsersService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async assignSubscription(userId: number, subscriptionId: string): Promise<UserSubscription> {
    const user = await this.usersService.findOneById(userId);
    const subscription = await this.subscriptionsService.findOne(subscriptionId);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + subscription.duration);

    const userSubscription = this.userSubscriptionsRepository.create({
      userId,
      subscriptionId,
      startDate,
      endDate,
    });

    return this.userSubscriptionsRepository.save(userSubscription);
  }

  async hasActiveSubscription(userId: number): Promise<boolean> {
    const userSubscriptions = await this.userSubscriptionsRepository.find({
      where: { userId },
    });

    if (!userSubscriptions.length) {
      return false;
    }

    const now = new Date();
    return userSubscriptions.some(
      (sub) => sub.startDate <= now && now <= sub.endDate,
    );
  }
}
