import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/utils/heplers/public.decorator';
import { Tokens } from './entities/tokens';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from './cummon/decorators/current-user.decorator';

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



}
