import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { toBoolean } from '../../common/utils/boolean-transformer';
import { ContentStatus } from '../../generated/prisma';

export class ProjectQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  categorySlug?: string;
}
