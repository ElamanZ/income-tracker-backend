import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';

export const UseJwtRefreshAuthGuard = () => {
  return applyDecorators(UseGuards(JwtRefreshAuthGuard), ApiBearerAuth());
};
