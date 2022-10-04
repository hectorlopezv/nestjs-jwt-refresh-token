import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { User } from '@prisma/client';
import { GetCurrentUserId } from 'src/common/decorators/ get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { RtGuard } from 'src/common/guards/rt.guard';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TokensInterceptor } from './interceptors/tokens.interceptors';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @SkipThrottle()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokensInterceptor)
  async signupLocal(@Body() dto: AuthDto): Promise<User> {
    const { user } = await this.authService.signupLocal(dto);
    return user;
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokensInterceptor)
  async signinLocal(@Body() dto: AuthDto): Promise<User> {
    const { user } = await this.authService.signinLocal(dto);
    return user;
  }

  @Throttle(3, 60)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<User> {
    const { user } = await this.authService.refreshTokens(userId, refreshToken);
    return user;
  }
}
