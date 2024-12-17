import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get('FIREBASE_PROJECT_ID'),
          privateKey: this.configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
          clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
        }),
      });
    }
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      throw new Error('Invalid Firebase token');
    }
  }

  async createUser(email: string, password: string): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
      return userRecord;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async signInWithEmailPassword(email: string, password: string): Promise<any> {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return userRecord;
    } catch (error) {
      throw new Error(`Error signing in user: ${error.message}`);
    }
  }

  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      throw new Error(`Error retrieving user: ${error.message}`);
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async updateUser(uid: string, updates: { email?: string; password?: string }): Promise<admin.auth.UserRecord> {
    try {
      const updatedUser = await admin.auth().updateUser(uid, updates);
      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async resetPassword(uid: string, newPassword: string): Promise<admin.auth.UserRecord> {
    try {
      const updatedUser = await admin.auth().updateUser(uid, {
        password: newPassword,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(`Error resetting password: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await admin.auth().generatePasswordResetLink(email);
    } catch (error) {
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
  }

  async generateCustomToken(uid: string): Promise<string> {
    try {
      const customToken = await admin.auth().createCustomToken(uid);
      return customToken;
    } catch (error) {
      throw new Error(`Error generating custom token: ${error.message}`);
    }
  }
}
