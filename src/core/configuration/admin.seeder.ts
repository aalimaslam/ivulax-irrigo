import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get('admin.adminEmail');
    const adminPassword = this.configService.get('admin.adminPassword');
    
    if (adminEmail && adminPassword) {
      await this.usersService.seedAdmin(adminEmail, adminPassword);
      console.log('Admin user seeded successfully');
    }
  }
}