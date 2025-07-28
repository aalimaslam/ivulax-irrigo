import { registerAs } from '@nestjs/config';

export default registerAs('multer', () => ({
  multerDest: process.env.MULTER_DEST,
  multerMaxFileSize: Number(process.env.MAX_FILE_SIZE) || 10485760,
}));
