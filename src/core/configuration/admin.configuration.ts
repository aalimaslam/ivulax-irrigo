import { registerAs } from '@nestjs/config';

export default registerAs('admin', () => ({
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
}));