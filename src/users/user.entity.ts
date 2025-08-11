import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserSubscription } from '../user-subscriptions/user-subscription.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  FARMER = 'farmer'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  name?: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty({ required: false })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty({ required: false })
  phone?: string;

  @Column({ nullable: true })
  otp?: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiry?: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.FARMER })
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  deviceUrl?: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.user)
  subscriptions: UserSubscription[];
}