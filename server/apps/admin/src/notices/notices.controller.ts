import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { Notice } from '@libs/db/models/notic.model';
import { CreateNoticeDto } from './dto/notice.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('notices')
@ApiTags('消息相关')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}
  @Get()
  @ApiOperation({ summary: '显示消息列表' })
  findAll(): Promise<Notice[]> {
    return this.noticesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '显示消息详情' })
  detail(@Param('id') id: string): Promise<Notice> {
    return this.noticesService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建消息' })
  create(@Body() createNoticeDto: CreateNoticeDto): Promise<Notice> {
    return this.noticesService.create(createNoticeDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改消息信息' })
  update(
    @Param('id') id: string,
    @Body() updateNoticeDto: CreateNoticeDto,
  ): Promise<Notice> {
    return this.noticesService.update(id, updateNoticeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除消息' })
  remove(@Param('id') id: string): Promise<any> {
    return this.noticesService.remove(id);
  }
}
