import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { Feedback } from '@libs/db/models/feedback.model';
import { FeedbacksService } from './feedbacks.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/feedback.dto';

@Controller('feedbacks')
@ApiTags('用户反馈相关')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}
  @Get()
  @ApiOperation({ summary: '显示我的反馈列表' })
  findAll(@Query('userId') userId: string): Promise<Feedback[]> {
    return this.feedbacksService.findMyAll(userId);
  }

  @Post()
  @ApiOperation({ summary: '创建反馈' })
  create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbacksService.create(createFeedbackDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '显示反馈详情' })
  detail(@Param('id') id: string): Promise<Feedback> {
    return this.feedbacksService.detail(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除反馈' })
  remove(@Param('id') id: string): Promise<any> {
    return this.feedbacksService.remove(id);
  }
}
