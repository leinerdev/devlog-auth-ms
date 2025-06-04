import { IsNotEmpty, IsString } from 'class-validator';
import { SignInRequestDto } from './sign-in-request.dto';

export class SignUpRequestDto extends SignInRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
