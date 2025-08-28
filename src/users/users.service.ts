import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';

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

  async createUserWithEmailPassword(
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    await this.usersRepository.update(id, updateProfileDto);
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updateOtp(id: number, otp: string, otpExpiry: Date): Promise<User> {
    await this.usersRepository.update(id, { otp, otpExpiry });
    return this.usersRepository.findOneBy({ id });
  }

  async clearOtp(id: number): Promise<void> {
    await this.usersRepository.update(id, { otp: null, otpExpiry: null });
  }

  async validateAdmin(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email, role: UserRole.ADMIN },
      select: ['id', 'email', 'password', 'role'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async seedAdmin(email: string, plainPassword: string) {
    let admin = await this.usersRepository.findOne({ where: { email } });

    const pass = await bcrypt.hash(plainPassword, 10);

    if (!admin) {
      admin = this.usersRepository.create({
        name: 'Super Admin',
        email,
        password: pass,
        role: UserRole.ADMIN,
      });
    } else {
      admin.password = pass;
      admin.role = UserRole.ADMIN;
    }

    await this.usersRepository.save(admin);
    console.log('Admin account processed:', email);
  }
}
