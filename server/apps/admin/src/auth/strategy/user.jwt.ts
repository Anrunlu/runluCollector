import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Admin } from '@libs/db/models/admin.model';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'UserJwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    } as StrategyOptions);
  }

  validate(id: string): Promise<Admin> {
    return this.authService.getAdmin(id);
  }
}
