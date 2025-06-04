import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { FirestoreService } from 'src/firestore/firestore.service';
import { GenericResponseDto } from 'src/common/dto/generic-response.dto';

import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './entities/user.entity';
import { AuthDataResponseDto } from './dto/auth-data-response.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  private readonly usersCollection = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly firestoreService: FirestoreService,
  ) {}

  public async signIn(
    signInRequest: SignInRequestDto,
  ): Promise<GenericResponseDto<AuthDataResponseDto>> {
    const response = new GenericResponseDto<AuthDataResponseDto>();
    try {
      const { email, password } = signInRequest;

      // Verify if user exists
      const user: User = (await this.firestoreService.getDocumentByCriteria(
        this.usersCollection,
        'email',
        email,
      )) as unknown as User;
      if (!user) {
        throw new BadRequestException('User does not exist.');
      }

      // Verify if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new BadRequestException('Credentials are incorrect.');
      }

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        email,
      };
      const token = this.jwtService.sign(payload);

      // Return response
      response.ok = true;
      response.data = { token, user };
    } catch (error) {
      response.ok = false;
      response.error = error instanceof Error ? error.message : 'Unknown error';
    }
    return response;
  }

  public async signUp(
    signUpRequest: SignUpRequestDto,
  ): Promise<GenericResponseDto<AuthDataResponseDto>> {
    const response = new GenericResponseDto<AuthDataResponseDto>();
    try {
      const { email, password, name } = signUpRequest;

      // Verify if users exists
      const existingUser: User =
        (await this.firestoreService.getDocumentByCriteria(
          this.usersCollection,
          'email',
          email,
        )) as unknown as User;
      if (existingUser) {
        throw new BadRequestException('User already exists.');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      // Create user document
      const newUser = {
        name,
        email,
        role: 'user',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save user in database
      const id = await this.firestoreService.addDocument(
        this.usersCollection,
        newUser,
      );

      // Generate JWT token
      const payload: JwtPayload = {
        sub: id,
        email,
      };
      const token = this.jwtService.sign(payload);
      response.ok = true;
      response.data = { token, user: { ...newUser, id } };
    } catch (error) {
      response.ok = false;
      response.error = error instanceof Error ? error.message : 'Unknown error';
    }
    return response;
  }

  async me(userPayload: JwtPayload): Promise<GenericResponseDto<User>> {
    const response = new GenericResponseDto<User>();
    try {
      const user: User = (await this.firestoreService.getDocumentByCriteria(
        this.usersCollection,
        'email',
        userPayload.email,
      )) as unknown as User;
      if (!user) {
        throw new BadRequestException('User does not exist.');
      }
      response.ok = true;
      response.data = user;
    } catch (error) {
      response.ok = false;
      response.error = error instanceof Error ? error.message : 'Unknown error';
    }
    return response;
  }
}
