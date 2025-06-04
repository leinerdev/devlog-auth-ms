import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456', description: 'User password' })
  password: string;
}
