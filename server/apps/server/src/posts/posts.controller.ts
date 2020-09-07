import {
  Controller,
  Param,
  Delete,
  Body,
  Put,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Post as PostFile } from '@libs/db/models/post.model';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@libs/db/models/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { MsgService } from '@app/msg';
import { QQMsg, msgType } from '@app/msg/message.dto';

@Controller('posts')
@ApiTags('文件管理')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class PostsController {
  constructor(
    private readonly cltsService: PostsService,
    private readonly msgService: MsgService,
  ) {}

  @Get()
  @ApiOperation({ summary: '显示我的文件列表' })
  findAll(@CurrentUser() user: DocumentType<User>): Promise<PostFile[]> {
    return this.cltsService.findMyPosts(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '显示文件详情' })
  detail(@Param('id') id: string): Promise<PostFile> {
    return this.cltsService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建新文件' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: DocumentType<User>,
  ): Promise<PostFile> {
    // 发送上传成功消息
    const content = `文件名：${createPostDto.origname}\n下载地址：${createPostDto.fileUrl}`;
    const msg: QQMsg = {
      type: msgType.POST_UPLOADED_NOTICE,
      content,
    };
    // 弃用以下代码，qq机器人服务已停止
    // await this.msgService.sendToOne(Number(user.qq), msg);
    return this.cltsService.create(createPostDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改文件信息' })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
  ): Promise<PostFile> {
    return this.cltsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  remove(@Param('id') id: string): Promise<any> {
    return this.cltsService.remove(id);
  }
}
