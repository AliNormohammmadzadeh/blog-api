import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './firebase-admin.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      const userRecord = await this.authService.signup(email, password);
      return { message: 'User created successfully', user: userRecord };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      const user = await this.authService.login(email, password);
      return { message: 'User logged in successfully', user };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('verify')
  async verify(@Body() body: { idToken: string }) {
    const { idToken } = body;
    try {
      const decodedToken = await this.authService.verifyToken(idToken);
      return { message: 'Token verified', decodedToken };
    } catch (error) {
      return { error: error.message };
    }
  }
}
