import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
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
  getMyTasks(@CurrentUser() user: DocumentType<User>): Promise<Collection[]> {
    return this.queryService.myTasks(user.groups as Types.ObjectId[]);
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
}
