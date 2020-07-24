import {
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { QiniuService } from '@app/qiniu';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from '../app.events';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('qiniu')
@ApiTags('七牛存储相关')
export class QiniuController {
  constructor(
    private readonly qiniuService: QiniuService,
    @InjectEventEmitter() private readonly emitter: MyEventEmitter,
  ) {}

  @Get('uploadToken')
  @UseGuards(AuthGuard('UserJwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取上传文件token令牌' })
  getUploadToken(): any {
    return this.qiniuService.generateUploadToken();
  }

  @Post('mkzipNotice')
  @ApiOperation({ summary: '接收云端打包结束通知' })
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  dealMkzipNotice(@Body() notification: any): void {
    if (notification.code === 0) {
      // 发送打包成功信号
      this.emitter.emit('mkzipEnd', notification.items[0].key);
    } else {
      // 发送打包失败信号
      this.emitter.emit('mkzipEnd', 'failed');
    }
  }

  @Delete('deleteSingleFile')
  @UseGuards(AuthGuard('UserJwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除单个文件' })
  deleteSingleFile(@Query('filekey') filekey: string): any {
    return this.qiniuService.deleteSingleFile(filekey);
  }
}
