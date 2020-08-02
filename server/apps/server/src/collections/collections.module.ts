import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { QueryService } from '../query/query.service';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, QueryService],
})
export class CollectionsModule {}
