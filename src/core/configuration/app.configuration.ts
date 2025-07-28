import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  appPort: parseInt(process.env.APP_PORT, 10) || 3000,
  appName: process.env.APP_NAME || 'Ace Braniac',
}));
