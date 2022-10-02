import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokes.type';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  hasData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }
  async signupLocal(authDto: AuthDto): Promise<Tokens> {
    const salt = await this.hasData(authDto.password);
    const newUser = this.prisma.user.create({
      data: {
        email: authDto.email,
        hash: salt,
      },
    });
  }

  signoutLocal() {}

  logout() {}

  refreshToken() {}
}
