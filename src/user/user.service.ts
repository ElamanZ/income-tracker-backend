import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { Tokens } from './entities/tokens';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService) { }

  async register(createUserDto: CreateUserDto) {

    const { phone, password, ...rest } = createUserDto

    const existingUser = await this.prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      throw new BadRequestException("Такой номер телефона уже зарегестрирован!")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        phone,
        encryptedPassword: hashedPassword
      }
    })

    const tokens = await this.generateTokens(user.id, user.phone);
    return tokens;
  }

  async login(loginUserDto: LoginUserDto) {
    const { phone, password } = loginUserDto
    const user = await this.prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      throw new BadRequestException("Неверный номер телефона или пароль!")
    }

    const isPasswordValid = await bcrypt.compare(password, user.encryptedPassword)

    if (!isPasswordValid) {
      throw new BadRequestException("Неверный номер телефона или пароль!")
    }

    const tokens = await this.generateTokens(user.id, user.phone);
    return tokens;
  }

  private async generateTokens(userId: string, phone: string): Promise<Tokens> {
    const payload = { sub: userId, phone };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
