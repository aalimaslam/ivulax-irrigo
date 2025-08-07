import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PhoneLoginDto, VerifyOtpDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for farmer login' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async requestOtp(@Body() { phone, deviceUrl }: PhoneLoginDto) {
    return this.authService.sendOtp(phone, deviceUrl);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for farmer login' })
  @ApiResponse({ status: 200, description: 'OTP verified, returns JWT token' })
  async verifyOtp(@Body() { phone, otp }: VerifyOtpDto) {
    return this.authService.verifyOtp(phone, otp);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login with email/password' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  async adminLogin(@Body() { email, password }: AdminLoginDto) {
    return this.authService.adminLogin(email, password);
  }
}