import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { GenericResponseDto } from 'src/common/dto/generic-response.dto';

import { AuthService } from './auth.service';

import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { AuthDataResponseDto } from './dto/auth-data-response.dto';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  ): Promise<GenericResponseDto<AuthDataResponseDto>> {
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
  ): Promise<GenericResponseDto<AuthDataResponseDto>> {
    return this.authService.signUp(signUpRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get user information by JWT token' })
  @ApiResponse({
    status: 200,
    description: 'User information',
  })
  @ApiBearerAuth('JWT Auth Token')
  public getUser(@Req() request: Request): Promise<GenericResponseDto<User>> {
    const userPayload = request['user'] as unknown as JwtPayload;
    return this.authService.me(userPayload);
  }
}
