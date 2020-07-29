import { Controller, Delete, Query, UseGuards } from '@nestjs/common';
import { QiniuService } from '@app/qiniu';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('qiniu')
@ApiTags('七牛存储相关')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {}

  @Delete('deleteSingleFile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除单个文件' })
  deleteSingleFile(@Query('filekey') filekey: string): any {
    return this.qiniuService.deleteSingleFile(filekey);
  }
}
