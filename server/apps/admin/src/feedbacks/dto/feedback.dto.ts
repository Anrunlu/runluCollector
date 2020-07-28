import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeedbackDto {
  @ApiProperty({ description: '状态', example: 'read' })
  status: string;
}
