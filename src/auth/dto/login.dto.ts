import { IsNotEmpty, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class PhoneLoginDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsUrl()
  @IsNotEmpty()
  deviceUrl: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  otp: string;
  
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}