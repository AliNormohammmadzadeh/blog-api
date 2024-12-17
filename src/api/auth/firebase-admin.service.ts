import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseAdminService: FirebaseService) {}

  async signup(email: string, password: string) {
    try {
      const userRecord = await this.firebaseAdminService.createUser(email, password);
      return userRecord;
    } catch (error) {
      throw new Error(`Error during user signup: ${error.message}`);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.firebaseAdminService.signInWithEmailPassword(email, password);
      return user;
    } catch (error) {
      throw new Error(`Error during user login: ${error.message}`);
    }
  }

  async verifyToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseAdminService.verifyToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error(`Error verifying token: ${error.message}`);
    }
  }
}
