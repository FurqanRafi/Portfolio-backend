import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { toBoolean } from '../../common/utils/boolean-transformer';
import { ContentStatus } from '../../generated/prisma';

export class ProjectQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 'saas' })
  @IsOptional()
  @IsString()
  categorySlug?: string;
}
