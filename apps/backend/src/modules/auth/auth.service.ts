import { BadRequestException, Body, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import { compareSync, hashSync } from 'bcryptjs';
import { SignOptions } from 'jsonwebtoken';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuid } from 'uuid';
import { AuthSignupRequest } from './dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}
  async signup(body: AuthSignupRequest) {
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
  async signin(@Body() body: AuthSignupRequest) {
    const dataUser = await this.prisma.account.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!dataUser) {
      throw new ForbiddenException('credentials incorrect');
    }
    const compare = compareSync(body.password, dataUser.password);

    if (!compare) {
      throw new ForbiddenException('credentials incorrect');
    }
    const token = {
      accessToken: this.signJwt(dataUser, dataUser.email, 3600 * 24, false),
      refreshToken: this.signJwt(dataUser, dataUser.email, 7200 * 24, true),
      expiresIn: 3600,
    };
    return token;
  }
  private signJwt(user: Account, subject: string, expires: number, isRefreshToken = false) {
    const options: SignOptions = {
      audience: 'order-invoices-app',
      issuer: 'order-invoices-app',
      expiresIn: expires,
      subject,
      keyid: uuid(),
    };
    if (isRefreshToken) {
      options.jwtid = uuid();
    }

    return this.jwtService.sign(
      {
        email: user.email,
        id: user.id,
      },
      options
    );
  }
}
