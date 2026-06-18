import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { toBoolean } from '../../common/utils/boolean-transformer';
import { ContactMessageStatus } from '../../generated/prisma';

export class MessageQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ContactMessageStatus,
    example: ContactMessageStatus.NEW,
  })
  @IsOptional()
  @IsEnum(ContactMessageStatus)
  status?: ContactMessageStatus;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isRead?: boolean;
}
