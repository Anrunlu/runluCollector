import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from '@libs/db/models/collection.model';
import { CollectionsService } from './collections.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@libs/db/models/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { AuthGuard } from '@nestjs/passport';
import { QueryService } from '../query/query.service';

@Controller('collections')
@ApiTags('收集管理')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class CollectionsController {
  constructor(
    private readonly cltsService: CollectionsService,
    private readonly queryService: QueryService,
  ) {}

  @Get('')
  @ApiOperation({ summary: '获取我创建的所有收集' })
  findMyAll(
    @CurrentUser() @CurrentUser() user: DocumentType<User>,
  ): Promise<Collection[]> {
    return this.cltsService.findMyAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '显示收集详情' })
  async detail(
    @Param('id') id: string,
    @Query('mode') mode: string,
    @CurrentUser() user: DocumentType<User>,
  ): Promise<Collection> {
    // 判断收集是否存在
    await this.queryService.isCollectionExist(id);
    // 判断是否可以进入收集
    await this.queryService.isCollectionGuest(user.id, id);
    let clt = null;
    if (mode === 'detail') {
      clt = await this.cltsService.getDetail(id);
    } else if (mode === 'titleAndGruops') {
      clt = await this.cltsService.getTitleAndGroups(id);
    } else {
      clt = await this.cltsService.getInfo(id);
    }
    return clt;
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
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    // 判断收集是否存在
    await this.queryService.isCollectionExist(id);

    return this.cltsService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除收集' })
  async remove(@Param('id') id: string): Promise<any> {
    // 判断收集是否存在
    await this.queryService.isCollectionExist(id);

    return this.cltsService.remove(id);
  }
}
