import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Group } from '@libs/db/models/group.model';

enum Property {
  public = 'public',
  private = 'private',
}

export class UpdateCollectionDto {
  @ApiProperty({ description: '标题', example: '收集1' })
  title: string;

  @ApiProperty({ description: '属性', example: Property.private })
  property: Property;

  @ApiProperty({ description: '描述', example: '这是收集1' })
  description: string;

  @ApiProperty({ description: '群组id', example: ['xxx'] })
  groups: Ref<Group>[];

  @ApiProperty({ description: '文件格式', example: ['.jpg', '.png'] })
  fileformat: string[];

  @ApiProperty({ description: '截止时间', example: Date.now() })
  endtime: Date;
}
