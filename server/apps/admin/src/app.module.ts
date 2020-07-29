import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { GroupsModule } from './groups/groups.module';
import { AdminsModule } from './admins/admins.module';
import { CollectionsModule } from './collections/collections.module';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from 'libs/common/src';
import { QiniuModule } from './qiniu/qiniu.module';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import { NoticesModule } from './notices/notices.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    OrgsModule,
    GroupsModule,
    AdminsModule,
    CollectionsModule,
    PostsModule,
    QiniuModule,
    NestEmitterModule.forRoot(new EventEmitter()),
    NoticesModule,
    FeedbacksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
