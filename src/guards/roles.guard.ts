import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';

import type { RoleType } from '../constants';
import type { UserEntity } from '../modules/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;

    //First check if user is authenticated
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // If no roles are required, allow access
    if (_.isEmpty(roles)) {
      return true;
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${roles.join(', ')}`,
      );
    }

    return roles.includes(user.role);
  }
}
