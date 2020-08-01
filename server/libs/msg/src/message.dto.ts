import { ApiProperty } from '@nestjs/swagger';

export class QQMsg {
  @ApiProperty({ description: '消息类型', example: 'sys_notice' })
  type: string;
  @ApiProperty({ description: '消息正文', example: '这是系统通知' })
  content: string;
}
