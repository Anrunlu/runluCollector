import { Module, HttpModule } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { QueryService } from '../query/query.service';
import { MsgService } from '@app/msg';

@Module({
  imports: [HttpModule],
  controllers: [CollectionsController],
  providers: [CollectionsService, QueryService, MsgService],
})
export class CollectionsModule {}
