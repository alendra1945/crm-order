import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from '@prisma/client';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Request & {
    user: Account;
  } = ctx.switchToHttp().getRequest();
  delete request.user.password;
  return request.user;
});
