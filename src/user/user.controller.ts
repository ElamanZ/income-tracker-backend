import { Controller, Post, Body, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/utils/heplers/public.decorator';
import { Tokens } from './entities/tokens';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) { }



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
