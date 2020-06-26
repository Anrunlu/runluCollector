import { Strategy, IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from '@libs/db/models/user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'UserLocal') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  validate(email: string, password: string): Promise<User> {
    return this.authService.validateUser(email, password);
  }
}
