import { Module, HttpModule } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MsgService } from '@app/msg';

@Module({
  imports: [HttpModule],
  controllers: [PostsController],
  providers: [PostsService, MsgService],
})
export class PostsModule {}
