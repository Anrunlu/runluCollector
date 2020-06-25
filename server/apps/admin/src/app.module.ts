import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from '@libs/db';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { GroupsModule } from './groups/groups.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    OrgsModule,
    GroupsModule,
    AdminsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
