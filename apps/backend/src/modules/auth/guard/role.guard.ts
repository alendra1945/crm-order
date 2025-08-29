import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Account, Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user: Account = context.switchToHttp().getRequest().user;
    if (user.role === Role.ADMIN) {
      return true;
    }
    return false;
  }
}
