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
import { CollectionsService } from './collections.service';
import { Collection } from '@libs/db/models/collection.model';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('collections')
@ApiTags('收集管理')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class CollectionsController {
  constructor(private readonly cltsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: '显示特定的收集列表' })
  findAll(
    @Query('org') orgId: string,
    @Query('group') groupId: string,
  ): Promise<Collection[]> {
    if (orgId === 'all') {
      // return 所有收集
      return this.cltsService.findAll();
    } else {
      if (groupId) {
        // return 所有收集 in 群组 in 组织
        return this.cltsService.findByGroup(groupId);
      } else {
        // return 所有收集 in 组织
        return this.cltsService.findByOrg(orgId);
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '显示收集详情' })
  detail(@Param('id') id: string): Promise<Collection> {
    return this.cltsService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建新收集' })
  create(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return this.cltsService.create(createCollectionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改收集信息' })
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return this.cltsService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除收集' })
  remove(@Param('id') id: string): Promise<any> {
    return this.cltsService.remove(id);
  }
}
