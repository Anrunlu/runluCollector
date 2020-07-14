import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QueryService } from './query.service';
import { Org } from '@libs/db/models/org.model';
import { AuthGuard } from '@nestjs/passport';
import { Collection } from '@libs/db/models/collection.model';
import { CurrentUser } from '../decorators/current-user.decorator';
import { DocumentType } from '@typegoose/typegoose';
import { User } from '@libs/db/models/user.model';
import { Types } from 'mongoose';
import { Group } from '@libs/db/models/group.model';
import { Post } from '@libs/db/models/post.model';

@ApiTags('查询接口')
@ApiBearerAuth()
@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Get('orgs')
  @ApiOperation({ summary: '显示组织列表' })
  getOrgList(): Promise<Org[]> {
    return this.queryService.orgList();
  }

  @Get('org/:id')
  @UseGuards(AuthGuard('UserJwt'))
  @ApiOperation({ summary: '获取组织详细信息' })
  getOrgDetail(@Param('id') id: string): Promise<any> {
    return this.queryService.orgDetail(id);
  }

  @Get('tasklist')
  @UseGuards(AuthGuard('UserJwt'))
  @ApiOperation({ summary: '获取收集任务列表' })
  getMyTasks(
    @CurrentUser() user: DocumentType<User>,
    @Query('type') type: string,
  ): Promise<Collection[]> {
    if (type === 'underway') {
      // 进行中
      return this.queryService.myUnderwayTasks(user.groups as Types.ObjectId[]);
    } else if (type === 'closed') {
      // 已截止
      return this.queryService.myClosedTasks(user.groups as Types.ObjectId[]);
    } else {
      // 所有
      return this.queryService.myAllTasks(user.groups as Types.ObjectId[]);
    }
  }

  @Get('myAccessableGroups')
  @UseGuards(AuthGuard('UserJwt'))
  @ApiOperation({ summary: '获取用户创建和管理的群组列表' })
  getMyAccessableGroups(
    @CurrentUser() user: DocumentType<User>,
  ): Promise<Group[]> {
    return this.queryService.myAccessableGroups(user.id);
  }

  @Get('isSubmitted')
  @UseGuards(AuthGuard('UserJwt'))
  @ApiOperation({ summary: '查询是否已提交过' })
  isSubmited(
    @CurrentUser() user: DocumentType<User>,
    @Query('cltId') cltId: string,
  ): Promise<Group[]> {
    return this.queryService.isSubmitted(cltId, user.id);
  }

  @Get('subInfo/:id')
  @UseGuards(AuthGuard('UserJwt'))
  @ApiOperation({ summary: '查询给定收集的详细提交信息' })
  getCltSubInfo(
    @Param('id') cltId: string,
    @Query('groupId') groupId: string,
    @Query('type') type: string,
  ): Promise<Post[] | User[]> {
    if (!groupId) {
      throw new BadRequestException();
    }
    if (type === 'submitted') {
      // 已提交列表
      return this.queryService.cltSubmittedList(cltId, groupId);
    } else if (type === 'unSubmitted') {
      // 未提交列表
      return this.queryService.cltUnsubmitList(cltId, groupId);
    } else {
      // 全部
      return this.queryService.cltNeedList(groupId);
    }
  }
}
