import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { ContactMessageStatus } from '../../generated/prisma';

export class UpdateMessageDto {
  @IsOptional()
  @IsEnum(ContactMessageStatus)
  status?: ContactMessageStatus;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
