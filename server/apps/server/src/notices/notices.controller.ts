import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { Notice } from '@libs/db/models/notic.model';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@libs/db/models/user.model';

@Controller('notices')
@ApiBearerAuth()
@UseGuards(AuthGuard('UserJwt'))
@ApiTags('消息相关')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}
  @Get()
  @ApiOperation({ summary: '显示该用户公共消息列表' })
  find(@CurrentUser() user: User): Promise<Notice[]> {
    return this.noticesService.find(user);
  }

  @Get(':id')
  @ApiOperation({ summary: '显示消息详情' })
  detail(@Param('id') id: string): Promise<Notice> {
    return this.noticesService.detail(id);
  }
}
