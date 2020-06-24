import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Group } from '@libs/db/models/group.model';
import { Org } from '@libs/db/models/org.model';

export class CreateUserDto {
  // @ApiProperty({ description: '组织id', example: '曲阜师范大学' })
  // org: Ref<Org>;

  @ApiProperty({ description: '学工号', example: '1001' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  password: string;

  @ApiProperty({ description: '姓名', example: '安润鲁' })
  nickname: string;

  @ApiProperty({ description: '邮箱', example: 'test@test.com' })
  email: string;

  @ApiProperty({ description: 'QQ号码', example: '1739046583' })
  qq: string;

  @ApiProperty({ description: '组id', example: ['5ef02ba109afba5b745c55af'] })
  groups?: Ref<Group>[];
}
