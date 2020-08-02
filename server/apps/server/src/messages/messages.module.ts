import { Module, HttpModule } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MsgService } from '@app/msg';
import { QueryService } from '../query/query.service';

@Module({
  imports: [HttpModule],
  controllers: [MessagesController],
  providers: [MsgService, QueryService],
})
export class MessagesModule {}
