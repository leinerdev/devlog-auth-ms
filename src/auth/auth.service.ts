import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { FirestoreService } from 'src/firestore/firestore.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';

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
  ): Promise<SignInResponseDto> {
    const response = new SignInResponseDto();
    try {
      const { email, password } = signInRequest;

      // Verify if user exists
      const user = await this.firestoreService.getDocumentByCriteria(
        this.usersCollection,
        'email',
        email,
      );
      if (!user) {
        throw new BadRequestException('User does not exist.');
      }

      // Verify if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new BadRequestException('Credentials are incorrect.');
      }

      // Generate JWT token
      const payload = {
        email,
        password,
      };
      const token = this.jwtService.sign(payload);

      // Return response
      response.ok = true;
      response.data = { token, user: payload };
    } catch (error) {
      response.ok = false;
      response.error = error instanceof Error ? error.message : 'Unknown error';
    }
    return response;
  }

  public async signUp(
    signUpRequest: SignUpRequestDto,
  ): Promise<SignInResponseDto> {
    const response = new SignInResponseDto();
    try {
      const { email, password, name } = signUpRequest;

      // Verify if users exists
      const existingUser = await this.firestoreService.getDocumentByCriteria(
        this.usersCollection,
        'email',
        email,
      );
      if (existingUser) {
        throw new BadRequestException('User already exists.');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      // Create user document
      const newUser = {
        name,
        email,
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
      const payload = {
        sub: id,
        email,
        name,
      };
      const token = this.jwtService.sign(payload);
      response.ok = true;
      response.data = { token, user: payload };
    } catch (error) {
      response.ok = false;
      response.error = error instanceof Error ? error.message : 'Unknown error';
    }
    return response;
  }
}
