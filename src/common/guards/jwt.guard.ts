import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/api/auth/firebase-admin.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const user = await this.authService.verifyToken(token);
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
