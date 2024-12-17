import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthService } from './firebase-admin.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [FirebaseService, AuthService],
})
export class AuthModule {}
