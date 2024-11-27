
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isAuth = request.headers.authorization === 'secret';
        if (!isAuth) throw new UnauthorizedException('Not authorized');

        return isAuth
    }
}
