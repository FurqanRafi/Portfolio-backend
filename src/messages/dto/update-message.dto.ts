import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { ContactMessageStatus } from '../../generated/prisma';

export class UpdateMessageDto {
  @ApiPropertyOptional({
    enum: ContactMessageStatus,
    example: ContactMessageStatus.REPLIED,
    description: 'Updated message workflow status.',
  })
  @IsOptional()
  @IsEnum(ContactMessageStatus)
  status?: ContactMessageStatus;

  @ApiPropertyOptional({
    example: true,
    description: 'Mark message as read/unread.',
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({
    example: '99ff717b-5a47-4f6c-83dc-6d2ce62c74c3',
    description: 'Admin user UUID assigned to this message.',
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
