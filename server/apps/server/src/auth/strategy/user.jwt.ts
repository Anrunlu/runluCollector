import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from '@libs/db/models/user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'UserJwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    } as StrategyOptions);
  }

  validate(id: string): Promise<User> {
    return this.authService.getUser(id);
  }
}
