import { SignInDataResponseDto } from './sign-in-data-response.dto';

export class SignInResponseDto {
  ok: boolean;
  error?: string;
  data?: SignInDataResponseDto;
}
