// guards/rpc-jwt-auth.guard.ts en el microservicio
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RpcJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();

    const token = data.token as string;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = (await this.jwtService.verifyAsync(
        token,
      )) as unknown as JwtPayload;

      data.user = payload;
    } catch (error) {
      throw new UnauthorizedException(`Invalid or expired token. ${error}`);
    }

    return true;
  }
}
