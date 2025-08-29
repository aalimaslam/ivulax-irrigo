import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get('JWT_ACCESS_SECRET') || 'aalimAccessSecret';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
  validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      deviceUrl: payload.deviceUrl,
    };
  }
}
