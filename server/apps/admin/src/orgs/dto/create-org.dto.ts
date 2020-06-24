import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Group } from '@libs/db/models/group.model';
import { Org } from '@libs/db/models/org.model';
import { Admin } from '@libs/db/models/admin.model';

export class CreateOrgDto {
  @ApiProperty({ description: '组织名', example: '曲阜师范大学' })
  name: string;

  @ApiProperty({ description: '创建者id', example: 'xxxx' })
  creator: Ref<Admin>;
}
