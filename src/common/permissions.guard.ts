import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsDecorator } from './custom.decorators';
import { ROLE } from './role.enum';
import { PERMISSIONS } from './permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('in permissions guard!');
    const permissions = this.reflector.get(
      PermissionsDecorator,
      context.getHandler(),
    );
    if (!permissions) {
      //if no permissions are required, return this guard allows
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    if (user.role === ROLE.ADMIN) {
      //If the user is an ADMIN, the permissions criteria is overriden and the guard allows
      return true;
    }
    const userHasAccessToHelpPage = user.help_pages_include.find(
      (user_help_pg) => user_help_pg.help_page.id === params.id,
    );
    if (!userHasAccessToHelpPage) {
      //If any permissions are required and the non-ADMIN user doesn't have any permissions on the page, the guard doesn't allow
      return false;
    }
    if (
      //Here, the user has some permissions, if the required permissions are minimum (VIEWER) or are the same as the user's, the guard allows
      permissions == PERMISSIONS.VIEWER ||
      permissions == userHasAccessToHelpPage.permissions
    ) {
      return true;
    }
    //console.log('in guard! user.help_pages_include: ', user.help_pages_include);
    //If we get here, is the last case: the user has VIEWER permissions, but EDITOR permissions are required, so the guard doesn't allow
    return false;
  }
}
