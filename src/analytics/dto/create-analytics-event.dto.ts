import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AnalyticsEventName } from '../../generated/prisma';

export class CreateAnalyticsEventDto {
  @IsEnum(AnalyticsEventName)
  eventName!: AnalyticsEventName;

  @IsOptional()
  @IsString()
  pageUrl?: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  metadata?: unknown;
}
