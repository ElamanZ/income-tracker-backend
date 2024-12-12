import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { Tokens } from './entities/tokens';
import { env } from 'src/env';
import { JwtPayload } from './entities/jwt-payload.entity';
import { JwtUserEntity } from './entities/jwt-user.entity';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';
import { JwtBaseEntity } from './entities/jwt-base.entity';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
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


  public async isRefreshTokenValid(
    jwtDecoded: JwtBaseEntity,
    refreshToken: string,
  ): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: jwtDecoded.jti },
    });

    if (!session?.hashedRefreshToken) {
      return false;
    }

    // const isTokensMatch = await this.compareWithHash(
    //   refreshToken,
    //   session.hashedRefreshToken,
    // );
    // const issuedAt = dayjs.unix(jwtDecoded.iat);
    // const diff = dayjs().diff(issuedAt, 'seconds');

    // this.logger.log({ isTokensMatch, diff }, !isTokensMatch && diff > 60);
    // if (!isTokensMatch && diff > 60) {
    //   await this.logout(jwtDecoded.sub);
    //   return false;
    // }

    return true;
  }

  async getTokensByUserId(userId: string, sessionId?: string): Promise<Tokens> {
    const user = await this.findOne(userId);
    return await this.generateTokens(user.id, sessionId);
  }




  async logoutSession(sessionId: string) {
    await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  private async compareWithHash(data: string, hash: string): Promise<boolean> {
    const hashedData = await this.hashData(data);
    return hashedData === hash;
  }


  private async hashData(data: string): Promise<string> {
    const result = crypto.createHash('sha256').update(data).digest('hex');
    return Promise.resolve(result);
  }

  private async createAccessToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: env.JWT_ACCESS_SECRET,
      subject: payload.uid,
      jwtid: nanoid(),
    });
  }

  private async createRefreshToken(
    payload: JwtPayload,
    sessionId?: string,
  ): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env.JWT_REFRESH_SECRET,
      subject: payload.uid,
      expiresIn: '30d',
      jwtid: sessionId ?? nanoid(),
    });

    const decodedRefreshToken = this.jwtService.decode<JwtUserEntity>(
      refreshToken,
      {
        json: true,
      },
    );

    await this.prisma.session.upsert({
      where: {
        id: decodedRefreshToken.jti,
      },
      create: {
        id: decodedRefreshToken.jti,
        hashedRefreshToken: await this.hashData(refreshToken),
        userId: payload.uid,
      },
      update: {
        hashedRefreshToken: await this.hashData(refreshToken),
      },
    });

    return refreshToken;
  }

  private async generateTokens(uid: string, sessionId?: string): Promise<Tokens> {
    const payload: JwtPayload = { uid: uid };

    // const accessToken = await this.jwtService.signAsync(payload, {
    //   secret: env.JWT_ACCESS_SECRET,
    //   expiresIn: '24h',
    // });

    // const refreshToken = await this.jwtService.signAsync(payload, {
    //   secret: env.JWT_REFRESH_SECRET,
    //   expiresIn: '7d',
    // });

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken(payload, sessionId),
    ]);

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
