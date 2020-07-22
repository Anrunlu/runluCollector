import { Module } from '@nestjs/common';
import { QiniuController } from './qiniu.controller';
import { QiniuService } from '@app/qiniu';

@Module({
  controllers: [QiniuController],
  providers: [QiniuService],
})
export class QiniuModule {}
