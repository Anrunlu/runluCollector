import { ApiProperty } from '@nestjs/swagger';
import { User } from '@libs/db/models/user.model';
import { Ref } from '@typegoose/typegoose';

export class CreateFeedbackDto {
  @ApiProperty({ description: '标题', example: '反馈测试' })
  title: string;

  @ApiProperty({ description: '类型', example: 'bug' })
  type: string;

  @ApiProperty({ description: '是否需要回复', example: true })
  needreply: boolean;

  @ApiProperty({ description: '创建者id', example: 'xxx' })
  creator: Ref<User>;

  @ApiProperty({ description: '详细描述', example: '反馈测试描述' })
  description: string;
}
