import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_ACCESS_TOKEN_STRATEGY } from './constants';
import { JwtPayload } from '../entities/jwt-payload.entity';
import { env } from 'src/env';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_ACCESS_TOKEN_STRATEGY,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_ACCESS_SECRET,
    } as StrategyOptions);
  }

  async validate(payload: any): Promise<JwtPayload> {
    return JwtPayload.createAsync(payload).catch(() => {
      console.log('Invalid access token', { payload });
      throw new UnauthorizedException('Invalid access token');
    });
  }
}
