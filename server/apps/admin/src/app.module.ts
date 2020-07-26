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

@Module({
  imports: [
    CommonModule,
    UsersModule,
    OrgsModule,
    GroupsModule,
    AdminsModule,
    CollectionsModule,
    PostsModule,
    QiniuModule,
    NestEmitterModule.forRoot(new EventEmitter()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
