import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose'
@Module({
  imports:[
    // 连接数据库
    TypegooseModule.forRoot('mongodb://localhost/runluCollector',{
      useNewUrlParser:true,
      useCreateIndex:true,
      useUnifiedTopology:true,
      useFindAndModify:false
    })
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
