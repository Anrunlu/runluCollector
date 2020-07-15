/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Body, Get, Post, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { User } from '@libs/db/models/user.model';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { DocumentType } from '@typegoose/typegoose';
import { UserDto } from './dto/user.dto';

@Controller('auth')
@ApiTags('用户鉴权')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @UseGuards(AuthGuard('UserLocal'))
  login(@Body() loginDto: LoginDto, @CurrentUser() user): any {
    return this.authService.generateJwtToken(String(user._id));
  }

  @Get('user')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('UserJwt'))
  user(@CurrentUser() user: DocumentType<User>) {
    return user;
  }

  @Put('user')
  @ApiOperation({ summary: '修改用户基本信息' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('UserJwt'))
  updateUserBaseInfo(
    @CurrentUser() user: DocumentType<User>,
    @Body() userDto: UserDto,
  ) {
    return this.authService.setUserBaseInfo(user.id, userDto);
  }
}
