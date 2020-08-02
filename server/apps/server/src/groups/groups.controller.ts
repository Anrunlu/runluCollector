import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { Group } from '@libs/db/models/group.model';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@libs/db/models/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { CreateGroupDto } from './dto/create-group.dto';
import { QueryService } from '../query/query.service';

@ApiTags('群组相关')
@ApiBearerAuth()
@UseGuards(AuthGuard('UserJwt'))
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly querService: QueryService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取分类群组列表' })
  getGroupsList(
    @CurrentUser() user: DocumentType<User>,
    @Query('type') type: string,
  ): Promise<Group[]> {
    if (type === 'joined') {
      return this.groupsService.joinedGroups(user.id);
    } else if (type === 'created') {
      return this.groupsService.createdGroups(user.id);
    } else {
      return this.groupsService.managedGroups(user.id);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取群组详情' })
  async getGroupDetail(
    @Param('id') groupId: string,
    @CurrentUser() user: DocumentType<User>,
  ): Promise<Group> {
    // 判断群组是否存在
    await this.querService.isGroupExist(groupId);
    // 判断是否可以进入群组
    await this.querService.isGroupGuset(user.id, groupId);
    return this.groupsService.detail(groupId);
  }

  @Post()
  @ApiOperation({ summary: '创建群组' })
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  @Get('join/:id')
  @ApiOperation({ summary: '加入群组' })
  join(
    @CurrentUser() user: DocumentType<User>,
    @Param('id') groupId: string,
  ): Promise<any> {
    return this.groupsService.join(
      user.id,
      (groupId as unknown) as Types.ObjectId,
    );
  }

  @Get('setManager/:id')
  @ApiOperation({ summary: '设置和取消管理员' })
  setManager(
    @CurrentUser() user: DocumentType<User>,
    @Param('id') groupId: string,
    @Query('userId') userId: string,
    @Query('type') type: string,
  ): Promise<any> {
    if (type === 'set') {
      return this.groupsService.setManager(
        user.id,
        (groupId as unknown) as Types.ObjectId,
        (userId as unknown) as Types.ObjectId,
      );
    } else {
      return this.groupsService.removeManager(
        user.id,
        (groupId as unknown) as Types.ObjectId,
        (userId as unknown) as Types.ObjectId,
      );
    }
  }

  @Get('leave/:id')
  @ApiOperation({ summary: '退出群组' })
  leave(
    @CurrentUser() user: DocumentType<User>,
    @Param('id') groupId: string,
  ): Promise<any> {
    return this.groupsService.leave(
      user.id,
      (groupId as unknown) as Types.ObjectId,
    );
  }

  @Delete('remove/:id')
  @ApiOperation({ summary: '解散群组' })
  remove(
    @CurrentUser() user: DocumentType<User>,
    @Param('id') groupId: string,
  ): Promise<any> {
    return this.groupsService.remove((groupId as unknown) as Types.ObjectId);
  }

  @Put('kickOut')
  @ApiOperation({ summary: '移除成员' })
  kickOut(
    @Query('userId') userId: string,
    @Query('groupId') groupId: string,
  ): any {
    return this.groupsService.kickOut(userId, groupId);
  }
}
