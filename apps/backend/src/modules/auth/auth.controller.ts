import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupRequest } from './dto';
import { AuthSigninRequest } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: AuthSignupRequest) {
    return await this.authService.signup(body);
  }

  @Post('signin')
  async signIn(@Body() body: AuthSigninRequest) {
    try {
      return await this.authService.signin(body);
    } catch (err) {
      throw err;
    }
  }
}
