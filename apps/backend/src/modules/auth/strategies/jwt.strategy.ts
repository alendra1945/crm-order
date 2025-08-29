import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountService } from 'src/modules/account/account.service';
import { JwtPayload } from './jwt.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: AccountService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      audience: 'order-invoices-app',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.userService.findById(payload.id);
      return user;
    } catch {
      throw new UnauthorizedException('Invalid jwt user');
    }
  }
}
