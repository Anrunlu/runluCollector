import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '用户名(邮箱)', example: 'test@test.com' })
  email: string;

  @ApiProperty({ description: '密码', example: '123456' })
  password: string;
}
