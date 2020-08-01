import { Module, HttpModule } from '@nestjs/common';
import { MsgService } from './msg.service';

@Module({
  imports: [HttpModule],
  providers: [MsgService],
  exports: [MsgService],
})
export class MsgModule {}
