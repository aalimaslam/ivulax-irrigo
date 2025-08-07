import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  FARMER = 'farmer'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ nullable: true })
  otp?: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiry?: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.FARMER })
  role: UserRole;

  @Column({ nullable: true })
  deviceUrl?: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}