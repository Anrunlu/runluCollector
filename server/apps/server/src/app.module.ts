import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@app/common';
import { QueryModule } from './query/query.module';
import { CollectionsModule } from './collections/collections.module';
import { PostsModule } from './posts/posts.module';
import { GroupsModule } from './groups/groups.module';
import { AppGateway } from './app.gateway';
import { QiniuModule } from './qiniu/qiniu.module';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { NoticesModule } from './notices/notices.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    QueryModule,
    CollectionsModule,
    PostsModule,
    GroupsModule,
    QiniuModule,
    NestEmitterModule.forRoot(new EventEmitter()),
    FeedbacksModule,
    NoticesModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
