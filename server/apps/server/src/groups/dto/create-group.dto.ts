import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { User } from '@libs/db/models/user.model';
import { Org } from '@libs/db/models/org.model';

export class CreateGroupDto {
  @ApiProperty({ description: '组名', example: '一班' })
  name: string;

  @ApiProperty({ description: '组id', example: 'class1', required: false })
  groupid: string;

  @ApiProperty({ description: '组织id', example: 'xxxx' })
  org: Ref<Org>;

  @ApiProperty({ description: '创建者id', example: 'xxxx' })
  creator: Ref<User>;

  @ApiProperty({
    required: false,
    description: '管理者id',
    example: ['xxx'],
  })
  manager: Ref<User>[];
}
