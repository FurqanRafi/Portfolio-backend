import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AnalyticsEventName } from '../../generated/prisma';

export class CreateAnalyticsEventDto {
  @ApiProperty({
    enum: AnalyticsEventName,
    example: AnalyticsEventName.PAGE_VIEW,
    description: 'Analytics event name.',
  })
  @IsEnum(AnalyticsEventName)
  eventName!: AnalyticsEventName;

  @ApiPropertyOptional({
    example: '/',
    description: 'Page URL where the event occurred.',
  })
  @IsOptional()
  @IsString()
  pageUrl?: string;

  @ApiPropertyOptional({
    example: 'https://google.com',
    description: 'HTTP referrer or campaign source.',
  })
  @IsOptional()
  @IsString()
  referrer?: string;

  @ApiPropertyOptional({
    example: { section: 'hero', cta: 'contact' },
    description: 'Additional event metadata as JSON.',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  metadata?: unknown;
}
