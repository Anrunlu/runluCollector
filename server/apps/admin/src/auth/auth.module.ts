import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserLocalStrategy } from './strategy/user.local';
import { UserJwtStrategy } from './strategy/user.jwt';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, UserLocalStrategy, UserJwtStrategy],
})
export class AuthModule {}
