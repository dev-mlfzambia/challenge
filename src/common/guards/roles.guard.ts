import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from 'src/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles required for this specific endpoint from the @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are defined, the endpoint is public (or only requires a valid JWT)
    if (!requiredRoles) {
      return true;
    }

    // 2. Extract the user from the request (attached by your JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 3. Check if the user has one of the required roles
    const hasRole = requiredRoles.some((role) => user.role?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}