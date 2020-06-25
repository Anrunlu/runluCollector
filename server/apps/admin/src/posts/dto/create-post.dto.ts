import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { User } from '@libs/db/models/user.model';
import { Org } from '@libs/db/models/org.model';
import { Group } from '@libs/db/models/group.model';
import { Collection } from '@libs/db/models/collection.model';

export class CreatePostDto {
  @ApiProperty({ description: '文件原始名称', example: '作业1.jpg' })
  origname: string;

  @ApiProperty({ description: '文件重命名后名称', example: '收集1' })
  filename: string;

  @ApiProperty({ description: '文件类型', example: '.jpg' })
  filetype: string;

  @ApiProperty({ description: '文件存储地址', example: 'http://xxx' })
  fileUrl: string;

  @ApiProperty({ description: '收集id', example: 'xxx' })
  desclt: Ref<Collection>;

  @ApiProperty({ description: '创建者id', example: 'xxx' })
  creator: Ref<User>;

  @ApiProperty({ description: '群组id', example: 'xxx' })
  groups: Ref<Group>;

  @ApiProperty({ description: '组织id', example: 'xxx' })
  org: Ref<Org>;
}
