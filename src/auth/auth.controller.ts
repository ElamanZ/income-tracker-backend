import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/utils/heplers/public.decorator';
import { AccessToken, Tokens } from './entities/tokens';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, JwtRefresh } from './cummon/decorators/current-user.decorator';
import { UseJwtRefreshAuthGuard } from './cummon/decorators/use-jwt-refresh-guard.decorator';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly userService: AuthService) { }


  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'My profile',
  })
  async getMyProfile(@CurrentUser('uid') userId: string) {
    return await this.userService.findOne(userId);
  }


  @Public()
  @Post('sign-up')
  async register(@Body() data: CreateUserDto): Promise<Tokens> {
    const signIn = await this.userService.register(data);
    return signIn
  }

  @Public()
  @Post('sign-in')
  async login(@Body() data: LoginUserDto): Promise<Tokens> {
    this.logger.debug({ data });
    return this.userService.login(data)
  }

  @Public()
  @Post('refresh')
  @UseJwtRefreshAuthGuard()
  async refresh(
    @JwtRefresh('uid') userId: string,
    @JwtRefresh('jti') tokenId: string,
  ): Promise<AccessToken> {
    return this.userService.getTokensByUserId(userId, tokenId);
  }


}
