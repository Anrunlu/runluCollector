import { Module, HttpModule } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MsgService } from '@app/msg';

@Module({
  imports: [HttpModule],
  controllers: [MessagesController],
  providers: [MsgService],
})
export class MessagesModule {}
