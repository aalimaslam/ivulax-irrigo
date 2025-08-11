import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  userId: number;

  @Column()
  @ApiProperty()
  subscriptionId: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Subscription)
  subscription: Subscription;

  @Column()
  @ApiProperty()
  amount: number;

  @Column()
  @ApiProperty()
  currency: string;

  @Column({ unique: true })
  @ApiProperty()
  razorpayOrderId: string;

  @Column({ nullable: true })
  @ApiProperty()
  razorpayPaymentId: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
