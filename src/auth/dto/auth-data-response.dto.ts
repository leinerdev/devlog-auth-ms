import { User } from '../entities/user.entity';

export class AuthDataResponseDto {
  token?: string;
  user?: User;
}
