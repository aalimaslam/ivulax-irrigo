import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionsRepository.create(createSubscriptionDto);
    return this.subscriptionsRepository.save(subscription);
  }

  findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepository.find();
  }

  findOne(id: string): Promise<Subscription> {
    return this.subscriptionsRepository.findOneBy({ id });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    await this.subscriptionsRepository.update(id, updateSubscriptionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionsRepository.delete(id);
  }
}
