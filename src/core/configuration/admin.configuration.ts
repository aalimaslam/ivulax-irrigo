import { registerAs } from '@nestjs/config';

export default registerAs('admin', () => ({
  adminUsername: process.env.ADMIN_USERNAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
}));
