import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByPhone(phone: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  async updateOtp(id: number, otp: string, otpExpiry: Date): Promise<User> {
    await this.usersRepository.update(id, { otp, otpExpiry });
    return this.usersRepository.findOneBy({ id }); // Changed to findOneBy
  }

  async clearOtp(id: number): Promise<void> {
    await this.usersRepository.update(id, { otp: null, otpExpiry: null });
  }

  async validateAdmin(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && user.role === UserRole.ADMIN && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    }
    return null;
  }

  async seedAdmin(email: string, password: string): Promise<void> {
    const adminExists = await this.findByEmail(email);
    if (!adminExists) {
      await this.create({
        email,
        password,
        role: UserRole.ADMIN
      });
    }
  }
}