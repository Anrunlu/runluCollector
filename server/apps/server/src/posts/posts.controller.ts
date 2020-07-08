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

@Controller('posts')
@ApiTags('文件管理')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly cltsService: PostsService) {}

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
  create(@Body() createPostDto: CreatePostDto): Promise<PostFile> {
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
