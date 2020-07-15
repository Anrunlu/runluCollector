import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: '姓名', example: '安润鲁' })
  nickname: string;

  @ApiProperty({ description: '邮箱', example: 'test@test.com' })
  email: string;

  @ApiProperty({ description: 'QQ号码', example: '1739046583' })
  qq: string;
}
