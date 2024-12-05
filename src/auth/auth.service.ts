import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { Tokens } from './entities/tokens';
import { env } from 'src/env';
import { JwtPayload } from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService) { }


  async findOne(id: string) {
    const profile = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return profile;
  }

  async register(createUserDto: CreateUserDto) {

    const { phone, password, passwordConfirm, ...rest } = createUserDto

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

    const tokens = await this.generateTokens(user.id);
    await this.createSession(user.id, tokens.refreshToken);
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

    const tokens = await this.generateTokens(user.id);
    await this.createSession(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async logoutSession(sessionId: string) {
    await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  private async generateTokens(uid: string): Promise<Tokens> {
    const payload: JwtPayload = { uid: uid };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.session.create({
      data: {
        userId,
        hashedRefreshToken,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const session = await this.prisma.session.findFirst({
      where: { userId },
      include: { user: true },
    });

    if (!session) {
      throw new BadRequestException('Сессия не найдена!');
    }

    const isValid = await bcrypt.compare(refreshToken, session.hashedRefreshToken);
    if (!isValid) {
      throw new BadRequestException('Неверный refresh token!');
    }

    const tokens = await this.generateTokens(userId);
    await this.updateSession(session.id, tokens.refreshToken);
    return tokens;
  }


  private async updateSession(sessionId: string, newRefreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { hashedRefreshToken },
    });
  }
}
