import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { toBoolean } from '../../common/utils/boolean-transformer';
import { ContactMessageStatus } from '../../generated/prisma';

export class MessageQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ContactMessageStatus)
  status?: ContactMessageStatus;

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isRead?: boolean;
}
