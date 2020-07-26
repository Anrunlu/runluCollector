import { Controller, Delete, Query } from '@nestjs/common';
import { QiniuService } from '@app/qiniu';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('qiniu')
@ApiTags('七牛存储相关')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {}

  @Delete('deleteSingleFile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除单个文件' })
  deleteSingleFile(@Query('filekey') filekey: string): any {
    return this.qiniuService.deleteSingleFile(filekey);
  }
}
