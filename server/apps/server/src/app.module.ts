import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@app/common';
import { QueryModule } from './query/query.module';
import { CollectionsModule } from './collections/collections.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [CommonModule, AuthModule, QueryModule, CollectionsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
