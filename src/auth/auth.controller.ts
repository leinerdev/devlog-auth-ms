import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  public signIn(@Body() signInRequest: SignInRequestDto) {
    return this.authService.signIn(signInRequest);
  }

  @Post('sign-up')
  public signUp(@Body() signUpRequest: SignUpRequestDto) {
    return this.authService.signUp(signUpRequest);
  }
}
