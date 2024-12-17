import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, 
    private readonly jwtAuthGuard: JwtAuthGuard 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
    if (!isAuthenticated) {
      throw new UnauthorizedException('You are not authenticated');
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = roles.some(role => user.roles?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required roles');
    }

    return true;
  }
}
