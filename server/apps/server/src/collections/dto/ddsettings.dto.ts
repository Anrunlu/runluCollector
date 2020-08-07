import { ApiProperty } from '@nestjs/swagger';

export class DingTalkRobotSettingsDto {
  @ApiProperty({ description: '钉钉机器人Webhook', example: 'xxxx' })
  ddwebhook: string;
  @ApiProperty({ description: '钉钉机器人Secret', example: 'xxxx' })
  ddsecret: string;
}
