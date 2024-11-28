
import { JwtPayload } from '../../entities/jwt-payload.entity';
import { JwtRefreshEntity } from 'src/auth/entities/jwt-refresh.entity';
import { createParamDecorator, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';


export const getUserFromExecutionContext = (context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  if (!req.user) {
    throw new Error('User not found in request');
  }
  return req.user;
};

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    try {
      const user = JwtPayload.create(getUserFromExecutionContext(context));
      if (!data) return user;
      return user[data];
    } catch (error) {
      const logger = new Logger('@CurrentUser()');
      logger.error(error);
      throw new UnauthorizedException('User not found');
    }
  },
);

export const JwtRefresh = createParamDecorator(
  (data: keyof JwtRefreshEntity | undefined, context: ExecutionContext) => {
    try {
      const user = JwtRefreshEntity.create(
        getUserFromExecutionContext(context),
      );
      if (!data) return user;
      return user[data];
    } catch (error) {
      const logger = new Logger('@JwtRefresh()');
      logger.error(error);
      throw new UnauthorizedException('User not found');
    }
  },
);
