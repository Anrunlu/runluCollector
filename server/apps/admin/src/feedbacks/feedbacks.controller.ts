import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Feedback } from '@libs/db/models/feedback.model';
import { FeedbacksService } from './feedbacks.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateFeedbackDto } from './dto/feedback.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('feedbacks')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
@ApiTags('用户反馈相关')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}
  @Get()
  @ApiOperation({ summary: '显示反馈列表' })
  findAll(): Promise<Feedback[]> {
    return this.feedbacksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '显示反馈详情' })
  detail(@Param('id') id: string): Promise<Feedback> {
    return this.feedbacksService.detail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改反馈信息' })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbacksService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除反馈' })
  remove(@Param('id') id: string): Promise<any> {
    return this.feedbacksService.remove(id);
  }
}
