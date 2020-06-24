import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from '@libs/db';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    OrgsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
