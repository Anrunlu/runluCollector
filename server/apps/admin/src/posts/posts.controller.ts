import {
  Controller,
  Param,
  Delete,
  Body,
  Put,
  Post,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Post as PostFile } from '@libs/db/models/post.model';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
@ApiTags('文件管理')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: '显示特定的文件列表' })
  findAll(
    @Query('org') orgId: string,
    @Query('group') groupId: string,
  ): Promise<PostFile[]> {
    if (orgId === 'all') {
      // return 所有文件
      return this.postsService.findAll();
    } else {
      if (groupId) {
        // return 所有文件 in 群组 in 组织
        return this.postsService.findByGroup(groupId);
      } else {
        // return 所有文件 in 组织
        return this.postsService.findByOrg(orgId);
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '显示文件详情' })
  detail(@Param('id') id: string): Promise<PostFile> {
    return this.postsService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建新文件' })
  create(@Body() createPostDto: CreatePostDto): Promise<PostFile> {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改文件信息' })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
  ): Promise<PostFile> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  remove(@Param('id') id: string): Promise<any> {
    return this.postsService.remove(id);
  }
}
