import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/local/signup')
  signupLocal() {
    this.authService.signinLocal();
  }

  @Post('/local/signout')
  signoutLocal() {
    this.authService.signoutLocal();
  }

  @Post('/logout')
  logout() {
    this.authService.logout();
  }

  @Post('/refresh')
  refreshToken() {
    this.authService.refreshToken();
  }
}
