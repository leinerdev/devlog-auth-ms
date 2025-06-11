import {
  Body,
  Controller,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { GenericResponseDto } from 'src/common/dto/generic-response.dto';

import { AuthService } from './auth.service';

import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { AuthDataResponseDto } from './dto/auth-data-response.dto';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RpcJwtAuthGuard } from './guards/rpc-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_sign_in' })
  public signIn(
    @Body() signInRequest: SignInRequestDto,
  ): Promise<GenericResponseDto<AuthDataResponseDto>> {
    return this.authService.signIn(signInRequest);
  }

  @MessagePattern({ cmd: 'auth_sign_up' })
  public signUp(
    @Body() signUpRequest: SignUpRequestDto,
  ): Promise<GenericResponseDto<AuthDataResponseDto>> {
    return this.authService.signUp(signUpRequest);
  }

  @UseGuards(RpcJwtAuthGuard)
  @MessagePattern({ cmd: 'auth_me' })
  public getUser(data: {
    user?: JwtPayload;
  }): Promise<GenericResponseDto<User>> {
    if (!data.user) {
      throw new UnauthorizedException('No user found');
    }
    return this.authService.me(data.user);
  }
}
