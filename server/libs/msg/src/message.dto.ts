import { ApiProperty } from '@nestjs/swagger';

export enum msgType {
  SYS_NOTICE = 'sys_notice',
  NEW_PRIVATE_TASK_NOTICE = 'new_private_task_notice',
  NEW_PUBLIC_TASK_NOTICE = 'new_public_task_notice',
  BEFORE_TASK_DONE_NOTICE = 'before_task_done_notice',
  CREATOR_NOTICE = 'creator_notice',
  POST_UPLOADED_NOTICE = 'post_uploaded_notice',
}

export class QQMsg {
  @ApiProperty({ description: '消息类型', example: 'sys_notice' })
  type: string;
  @ApiProperty({ description: '消息正文', example: '这是系统通知' })
  content: string;
}
