import { Controller, Get, UseGuards } from '@nestjs/common';
import { QiniuService } from '@app/qiniu';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('qiniu')
@ApiTags('七牛存储相关')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {}

  @Get('uploadToken')
  @ApiOperation({ summary: '获取上传文件token令牌' })
  getUploadToken(): any {
    return this.qiniuService.generateUploadToken();
  }
}
