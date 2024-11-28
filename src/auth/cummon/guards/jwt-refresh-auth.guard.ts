import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_TOKEN_STRATEGY } from '../../strategies/constants';

export class JwtRefreshAuthGuard extends AuthGuard(
  JWT_REFRESH_TOKEN_STRATEGY,
) { }
