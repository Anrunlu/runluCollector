import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from '@libs/db/models/collection.model';
import { CollectionsService } from './collections.service';

@Controller('collections')
@ApiTags('收集管理')
@ApiBearerAuth()
export class CollectionsController {
  constructor(private readonly cltsService: CollectionsService) {}

  @Post()
  @ApiOperation({ summary: '创建新收集' })
  create(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return this.cltsService.create(createCollectionDto);
  }
}
