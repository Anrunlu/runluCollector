import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryService } from './query.service';
import { Org } from '@libs/db/models/org.model';

@ApiTags('查询接口')
@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Get('orgs')
  @ApiOperation({ summary: '显示组织列表' })
  getOrgList(): Promise<Org[]> {
    return this.queryService.orgList();
  }

  @Get('org/:id')
  @ApiOperation({ summary: '获取组织详细信息' })
  getOrgDetail(@Param('id') id: string): Promise<any> {
    return this.queryService.orgDetail(id);
  }
}
