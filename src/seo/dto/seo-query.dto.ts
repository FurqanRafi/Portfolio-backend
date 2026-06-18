import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SeoQueryDto {
  @ApiPropertyOptional({
    example: '44444444-4444-4444-8444-444444444444',
    description: 'Optional page/entity UUID reference.',
  })
  @IsOptional()
  @IsUUID()
  pageRefId?: string;

  @ApiPropertyOptional({ example: 'home', description: 'Search SEO records.' })
  @IsOptional()
  @IsString()
  search?: string;
}
