import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Admin } from './models/admin.model';
import { User } from './models/user.model';
import { Org } from './models/org.model';
import { Group } from './models/group.model';
import { Collection } from './models/collection.model';
import { Post } from './models/post.model';
import { Notice } from './models/notic.model';
import { Feedback } from './models/feedback.model';
import { UserAction } from './models/user.action.model';

const models = TypegooseModule.forFeature([
  Admin,
  Org,
  User,
  Group,
  Collection,
  Post,
  Notice,
  Feedback,
  UserAction,
]);
@Global()
@Module({
  imports: [
    // 连接数据库
    TypegooseModule.forRootAsync({
      useFactory() {
        return {
          uri: process.env.DB,
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        };
      },
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
