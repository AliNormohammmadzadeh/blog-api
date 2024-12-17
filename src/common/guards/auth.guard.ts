import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      return false;
    }

    try {
      const decodedToken = await this.firebaseService.verifyToken(token);
      request.user = decodedToken;
      return true;
    } catch (e) {
      return false;
    }
  }
}
