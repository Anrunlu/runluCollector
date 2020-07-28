import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Admin } from '@libs/db/models/admin.model';
import { Org } from '@libs/db/models/org.model';
import { Group } from '@libs/db/models/group.model';
import { User } from '@libs/db/models/user.model';

export class CreateNoticeDto {
  @ApiProperty({ description: '消息类型', example: 'notice' })
  type: string;

  @ApiProperty({ description: '创建者id', example: '5ef3f9a54ff82d0764020c11' })
  sender: Ref<Admin>;

  @ApiProperty({ description: '接收者类型', example: 'Org' })
  receivertype: string;

  @ApiProperty({ description: '接收者id', example: 'Org' })
  receiver: Ref<Org | Group | User>;

  @ApiProperty({ description: '状态', example: 'published' })
  status: string;

  @ApiProperty({ description: '消息标题', example: '测试消息' })
  title: string;

  @ApiProperty({ description: '消息正文', example: '测试消息正文' })
  content: string;
}
