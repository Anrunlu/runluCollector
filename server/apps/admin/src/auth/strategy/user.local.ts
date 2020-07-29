import { Strategy, IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Admin } from '@libs/db/models/admin.model';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'UserLocal') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  validate(email: string, password: string): Promise<Admin> {
    return this.authService.validateAdmin(email, password);
  }
}
