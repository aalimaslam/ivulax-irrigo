import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Update sendOtp to accept deviceUrl
  async sendOtp(phone: string, deviceUrl: string) {
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    let user = await this.usersService.findByPhone(phone);

    if (!user) {
      user = await this.usersService.create({
        phone,
        deviceUrl,
        otp,
        otpExpiry,
        role: UserRole.FARMER,
      });
    } else {
      user = await this.usersService.updateOtp(user.id, otp, otpExpiry);
      if (deviceUrl) {
        user.deviceUrl = deviceUrl;
        await this.usersService.create(user);
      }
    }

    console.log(`OTP for ${phone}: ${otp}`);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string) {
    const user = await this.usersService.findByPhone(phone);

    if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
      throw new Error('Invalid OTP');
    }

    await this.usersService.clearOtp(user.id);

    const payload = {
      phone: user.phone,
      sub: user.id,
      role: user.role,
      deviceUrl: user.deviceUrl,
    };
    console.log('JWT Payload being signed:', payload);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        deviceUrl: user.deviceUrl,
      },
    };
  }

  async adminLogin(email: string, password: string) {
    //  console.log(`Attempting admin login for: ${email}`);
    const user = await this.usersService.validateAdmin(email, password);
    if (!user) {
      console.log('Login failed - invalid credentials');
      throw new Error('Invalid credentials');
    }
    // console.log('Login successful for admin:', email);
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
