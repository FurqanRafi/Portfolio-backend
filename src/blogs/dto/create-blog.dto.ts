import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import { ContentStatus } from '../../generated/prisma';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Building Scalable SaaS Products',
    maxLength: 250,
    description: 'Blog title.',
  })
  @IsString()
  @MaxLength(250)
  title!: string;

  @ApiPropertyOptional({
    example: 'building-scalable-saas-products',
    maxLength: 270,
    description: 'SEO-friendly slug. If omitted, generated from title.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(270)
  slug?: string;

  @ApiPropertyOptional({
    example: 'Practical notes on architecture, delivery, and maintainability.',
    description: 'Short blog excerpt for cards and SEO previews.',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    example: 'Long-form markdown or rich text content goes here.',
    description: 'Full blog content.',
  })
  @IsString()
  content!: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/blog-cover.png',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({
    example: 'a2f79f99-d2c7-4420-bc33-a20f4a718ce2',
    description: 'Blog category UUID.',
  })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    example: 4,
    minimum: 1,
    description: 'Estimated read time in minutes.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  readingTime?: number;

  @ApiPropertyOptional({ example: 'Building Scalable SaaS Products' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({
    example: 'A practical guide to building scalable SaaS products.',
  })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['a2f79f99-d2c7-4420-bc33-a20f4a718ce2'],
    description: 'Blog tag UUIDs.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}
