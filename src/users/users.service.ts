import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  findOneById(_id: number) {
    throw new Error('Method not implemented.');
  }
  update(_id: number, _updateUserDto: UpdateUserDto) {
    throw new Error('Method not implemented.');
  }
  remove(_id: number) {
    throw new Error('Method not implemented.');
  }
  createUserWithEmailPassword: any;
  findAll: any;
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
    return this.usersRepository.findOneBy({ id }); 
  }

  async clearOtp(id: number): Promise<void> {
    await this.usersRepository.update(id, { otp: null, otpExpiry: null });
  }

// async validateAdmin(email: string, password: string): Promise<User | null> {
//   const user = await this.usersRepository.findOne({ 
//     where: { email, role: UserRole.ADMIN }
//   });
  
//   if (!user || !user.password) {
//     return null;
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   return isMatch ? user : null;
// }

async validateAdmin(email: string, password: string) {
  const user = await this.usersRepository.findOne({
    where: { email, role: UserRole.ADMIN },
    select: ['id', 'email', 'password', 'role'],
  });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
}

  async seedAdmin(email: string, plainPassword: string) {
  let admin = await this.usersRepository.findOne({ where: { email } });

  // const hashedPassword = await bcrypt.hash(plainPassword, 10);

  if (!admin) {
 admin = this.usersRepository.create({
  name: 'Super Admin',
  email,
  password: plainPassword, 
  role: UserRole.ADMIN,
});
    await this.usersRepository.save(admin);
    console.log('Admin account created:', email);
  } else {
    admin.password = plainPassword;
    admin.role = UserRole.ADMIN;
    await this.usersRepository.save(admin);
    console.log('Admin account updated:', email);
  }
}

}

