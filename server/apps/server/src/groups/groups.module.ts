import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { QueryService } from '../query/query.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, QueryService],
})
export class GroupsModule {}
