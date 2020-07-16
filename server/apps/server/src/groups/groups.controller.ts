import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { Group } from '@libs/db/models/group.model';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@libs/db/models/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('群组相关')
@ApiBearerAuth()
@UseGuards(AuthGuard('UserJwt'))
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

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
  getGroupDetail(@Param('id') groupId: string): Promise<Group> {
    return this.groupsService.detail(groupId);
  }
}
