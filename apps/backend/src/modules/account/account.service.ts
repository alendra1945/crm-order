import { BadRequestException, Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { PrismaService } from 'nestjs-prisma';
import { AuthSignupRequest } from '../auth/dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string) {
    const user = await this.prisma.account.findUnique({
      where: {
        id,
      },
    });
    return user;
  }
  async create(body: AuthSignupRequest) {
    const passHass = hashSync(body.password, 12);
    const exitedUser = await this.prisma.account.findUnique({
      where: {
        email: body.email,
      },
    });
    if (exitedUser) {
      throw new BadRequestException('User already exist');
    }
    const newUser = await this.prisma.account.create({
      data: {
        email: body.email,
        password: passHass,
        avatarUrl: `/avatar/avatar-${Math.floor(Math.random() * 12) + 1}.png`,
      },
      select: {
        id: true,
        email: true,
        avatarUrl: true,
      },
    });

    return newUser;
  }
  async getMe(id: string) {
    const user = await this.prisma.account.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async listAccount() {
    const user = await this.prisma.account.findMany({});
    return user;
  }
}
