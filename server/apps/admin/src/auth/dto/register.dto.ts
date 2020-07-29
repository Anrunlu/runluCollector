import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: '1001' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  password: string;

  @ApiProperty({ description: '姓名', example: '安润鲁' })
  nickname: string;

  @ApiProperty({ description: '邮箱', example: 'test@test.com' })
  email: string;

  @ApiProperty({ description: 'QQ号码', example: '1739046583' })
  qq: string;
}
