import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { User } from '@libs/db/models/user.model';
import { Org } from '@libs/db/models/org.model';
import { Group } from '@libs/db/models/group.model';

enum Property {
  public = 'public',
  private = 'private',
}

export class CreateCollectionDto {
  @ApiProperty({ description: '标题', example: '收集1' })
  title: string;

  @ApiProperty({ description: '创建者id', example: 'xxx' })
  creator: Ref<User>;

  @ApiProperty({ description: '属性', example: Property.private })
  property: Property;

  @ApiProperty({ description: '组织id', example: 'xxx' })
  org: Ref<Org>;

  @ApiProperty({ description: '描述', example: '这是收集1' })
  description: string;

  @ApiProperty({ description: '群组id', example: ['xxx'] })
  groups: Ref<Group>[];

  @ApiProperty({ description: '文件格式', example: ['.jpg', '.png'] })
  fileformat: string[];

  @ApiProperty({ description: '文件重命名规则', example: 1 })
  renamerule: number;

  @ApiProperty({ description: '截止时间', example: Date.now() })
  endtime: Date;

  @ApiProperty({ description: '终止时间', example: Date.now() })
  firetime: Date;
}
