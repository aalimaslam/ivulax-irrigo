import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  userId: number;

  @Column()
  @ApiProperty()
  subscriptionId: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @ManyToOne(() => Subscription, (subscription) => subscription.userSubscriptions)
  subscription: Subscription;

  @Column({ type: 'timestamp' })
  @ApiProperty()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty()
  endDate: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
