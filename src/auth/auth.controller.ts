import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
  })
  public signIn(
    @Body() signInRequest: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(signInRequest);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  public signUp(
    @Body() signUpRequest: SignUpRequestDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signUp(signUpRequest);
  }
}
