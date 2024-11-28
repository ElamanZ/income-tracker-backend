import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'nestjs-prisma';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './cummon/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './cummon/guards/jwt-refresh-auth.guard';
import { AccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { env } from 'src/env';
@Global()
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: '7d',
        issuer: 'income-tracker',
        algorithm: 'HS256',
      },
    })
  ],
  controllers: [AuthController],
  providers: [
    JwtAuthGuard,
    JwtRefreshAuthGuard,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],

  exports: [AuthService],
})
export class AuthModule { }
