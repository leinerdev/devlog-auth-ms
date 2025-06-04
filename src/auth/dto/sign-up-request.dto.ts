import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignInRequestDto } from './sign-in-request.dto';

export class SignUpRequestDto extends SignInRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;
}
