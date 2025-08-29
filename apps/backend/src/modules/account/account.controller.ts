import { Controller, Get, UseGuards } from '@nestjs/common';
import { Account } from '@prisma/client';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { AccountService } from './account.service';

@UseGuards(JwtGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('me')
  async getMe(@GetUser() user: Account) {
    return this.accountService.getMe(user.id);
  }

  @Get('list')
  @UseGuards(RolesGuard)
  async listAccount() {
    return this.accountService.listAccount();
  }
}
