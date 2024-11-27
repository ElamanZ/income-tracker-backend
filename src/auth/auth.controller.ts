import { Controller, Post, Body, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/utils/heplers/public.decorator';
import { Tokens } from './entities/tokens';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly userService: AuthService) { }



  @Public()
  @Post('register')
  async register(@Body() data: CreateUserDto): Promise<Tokens> {
    const signIn = await this.userService.register(data);
    return signIn
  }

  @Public()
  @Post('login')
  async login(@Body() data: LoginUserDto): Promise<Tokens> {
    this.logger.debug({ data });
    return this.userService.login(data)
  }



}
