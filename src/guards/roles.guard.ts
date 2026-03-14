import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';

import type { RoleType } from '../constants';
import type { UserEntity } from '../modules/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RoleType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]) || this.reflector.getAllAndOverride<RoleType[]>('auditRoles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (_.isEmpty(roles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;

    return roles.includes(user.role);
  }
}
