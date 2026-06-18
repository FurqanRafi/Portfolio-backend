import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AnalyticsEventName } from '../../generated/prisma';

export class AnalyticsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(AnalyticsEventName)
  eventName?: AnalyticsEventName;

  @IsOptional()
  @Transform(({ value }) => new Date(value as string | number | Date))
  @IsDate()
  from?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value as string | number | Date))
  @IsDate()
  to?: Date;
}
