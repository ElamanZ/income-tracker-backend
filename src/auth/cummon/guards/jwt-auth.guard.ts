import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JWT_ACCESS_TOKEN_STRATEGY } from 'src/auth/strategies/constants';
import { IS_PUBLIC_META_KEY } from 'src/utils/heplers/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_ACCESS_TOKEN_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_META_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
