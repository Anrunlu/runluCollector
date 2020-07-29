/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Body, Get, Post, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { DocumentType } from '@typegoose/typegoose';
import { ChgPasswordDto } from './dto/chgpassword.dto';
import { Admin } from '@libs/db/models/admin.model';

@Controller('auth')
@ApiTags('管理员鉴权')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '管理员登录' })
  @UseGuards(AuthGuard('UserLocal'))
  login(@Body() loginDto: LoginDto, @CurrentUser() user): any {
    return this.authService.generateJwtToken(String(user._id));
  }

  @Get('admin')
  @ApiOperation({ summary: '获取管理员信息' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('UserJwt'))
  user(@CurrentUser() admin: DocumentType<Admin>) {
    return admin;
  }

  @Put('chgPassword')
  @ApiOperation({ summary: '修改密码' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('UserJwt'))
  changePassword(
    @CurrentUser() admin: DocumentType<Admin>,
    @Body() chgPasswordDto: ChgPasswordDto,
  ) {
    return this.authService.changePassword(admin.id, chgPasswordDto);
  }
}
