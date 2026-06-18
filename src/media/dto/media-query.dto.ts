import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class MediaQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'image/png',
    description: 'Filter by MIME type.',
  })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiPropertyOptional({
    example: 'cloudinary',
    description: 'Filter by storage provider.',
  })
  @IsOptional()
  @IsString()
  provider?: string;
}
