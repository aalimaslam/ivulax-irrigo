import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUserWithEmailPassword(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOrCreateUserByPhone(phone: string, deviceUrl: string): Promise<User> {
    let user = await this.findByPhone(phone);
    if (!user) {
      user = this.usersRepository.create({
        phone,
        deviceUrl,
        role: UserRole.FARMER,
      });
      await this.usersRepository.save(user);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    // if password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateOtp(id: number, otp: string, otpExpiry: Date): Promise<User> {
    await this.usersRepository.update(id, { otp, otpExpiry });
    return this.usersRepository.findOneBy({ id });
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

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && user.role === UserRole.FARMER && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    }
    return null;
  }

  async seedAdmin(email: string, password: string): Promise<void> {
    const adminExists = await this.findByEmail(email);
    if (!adminExists) {
      await this.createUserWithEmailPassword({
        email,
        password,
        role: UserRole.ADMIN,
        name: 'Admin'
      });
    }
  }
}