import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AnalyticsEventName } from '../../generated/prisma';

export class AnalyticsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: AnalyticsEventName,
    example: AnalyticsEventName.PAGE_VIEW,
  })
  @IsOptional()
  @IsEnum(AnalyticsEventName)
  eventName?: AnalyticsEventName;

  @ApiPropertyOptional({
    example: '2026-06-01T00:00:00.000Z',
    description: 'Start datetime in ISO format.',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value as string | number | Date))
  @IsDate()
  from?: Date;

  @ApiPropertyOptional({
    example: '2026-06-30T23:59:59.999Z',
    description: 'End datetime in ISO format.',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value as string | number | Date))
  @IsDate()
  to?: Date;
}
