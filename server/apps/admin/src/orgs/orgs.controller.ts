import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Org } from '@libs/db/models/org.model';
import { CreateOrgDto } from './dto/create-org.dto';

@Controller('orgs')
@ApiTags('组织管理')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Get()
  @ApiOperation({ summary: '显示组织列表' })
  findAll(@Query('type') type: string): Promise<Org[]> {
    return this.orgsService.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: '显示组织详情' })
  detail(@Param('id') id: string): Promise<Org> {
    return this.orgsService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建组织' })
  create(@Body() createOrgDto: CreateOrgDto): Promise<Org> {
    return this.orgsService.create(createOrgDto);
  }

  @Post('/createMany')
  @ApiOperation({ summary: '批量创建组织' })
  createMany(@Body() createManyDto: CreateOrgDto[]): Promise<any> {
    return this.orgsService.createMany(createManyDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改组织信息' })
  update(
    @Param('id') id: string,
    @Body() updateOrgDto: CreateOrgDto,
  ): Promise<Org> {
    return this.orgsService.update(id, updateOrgDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除组织' })
  remove(@Param('id') id: string): Promise<any> {
    return this.orgsService.remove(id);
  }
}
