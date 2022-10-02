import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwt } from './strategies/auth.strategies';
import { RefreshJWT } from './strategies/refresh_token.strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthJwt, RefreshJWT],
})
export class AuthModule {}
