import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokes.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signupLocal(authDto: AuthDto): Promise<Tokens> {
    const hash = await this.hasData(authDto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: authDto.email,
        hash: hash,
      },
    });
    const { access_token, refresh_token } = await this.getTokens(
      newUser.id,
      newUser.email,
    );
    await this.updateRtHash(newUser.id, refresh_token);
    return { access_token, refresh_token };
  }

  hasData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async updateRtHash(userId: number, refreshToken: string) {
    const hash = await this.hasData(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessTk, refreshTK] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_TOKEN'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: accessTk,
      refresh_token: refreshTK,
    };
  }
}
