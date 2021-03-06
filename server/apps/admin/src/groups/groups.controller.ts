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
import { GroupsService } from './groups.service';
import { Group } from '@libs/db/models/group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
@ApiTags('群组管理')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: '显示特定的群组列表' })
  findAll(
    @Query('type') type: string,
    @Query('orgId') orgId: string,
  ): Promise<Group[]> {
    if (type === 'query') {
      return this.groupsService.findByOrg(orgId);
    } else if (type === 'byOrgWithDetail') {
      return this.groupsService.findByOrgWithDetail(orgId);
    } else {
      return this.groupsService.findAll();
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '显示群组详情' })
  detail(@Param('id') id: string): Promise<Group> {
    return this.groupsService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建新群组' })
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改群组信息' })
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除群组' })
  remove(@Param('id') id: string): Promise<any> {
    return this.groupsService.remove(id);
  }
}
