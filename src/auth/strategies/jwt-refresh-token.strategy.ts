import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWT_REFRESH_TOKEN_STRATEGY } from './constants';
import { JwtRefreshEntity } from '../entities/jwt-refresh.entity';
import { AuthService } from '../auth.service';
import { env } from 'src/env';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_TOKEN_STRATEGY,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    } as StrategyOptions);
  }
  async validate(req: Request, payload: any): Promise<JwtRefreshEntity> {
    const refreshToken = req.get('Authorization')?.split(' ')[1];

    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    const jwtDecoded = await JwtRefreshEntity.createAsync(payload).catch(() => {
      throw new ForbiddenException('Invalid refresh token');
    });

    const isRefreshTokenValid = await this.authService.isRefreshTokenValid(
      jwtDecoded,
      refreshToken,
    );

    if (!isRefreshTokenValid)
      throw new ForbiddenException('Invalid refresh token');

    return jwtDecoded;
  }

}
