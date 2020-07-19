import { ApiProperty } from '@nestjs/swagger';

export class ChgPasswordDto {
  @ApiProperty({ description: '原密码', example: 'xxx' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: 'xxx' })
  newPassword: string;
}
