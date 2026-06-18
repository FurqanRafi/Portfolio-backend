import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateSeoDto {
  @ApiProperty({
    example: 'home',
    maxLength: 100,
    description: 'Page type or route key, e.g. home, about, project, blog.',
  })
  @IsString()
  @MaxLength(100)
  pageType!: string;

  @ApiPropertyOptional({
    example: '44444444-4444-4444-8444-444444444444',
    description: 'Optional UUID for project/blog/entity-specific SEO.',
  })
  @IsOptional()
  @IsUUID()
  pageRefId?: string;

  @ApiProperty({
    example: 'Muhammad Furqan Rafique | Full Stack Developer',
    maxLength: 255,
    description: 'SEO title.',
  })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    example:
      'Full Stack Developer building SaaS products and modern web experiences.',
    description: 'SEO meta description.',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    example: 'Full Stack Developer, Next.js, NestJS, SaaS',
  })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional({ example: 'https://furqan.dev/' })
  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @ApiPropertyOptional({
    example: 'Muhammad Furqan Rafique | Full Stack Developer',
  })
  @IsOptional()
  @IsString()
  ogTitle?: string;

  @ApiPropertyOptional({
    example: 'Interactive 3D portfolio for full-stack development work.',
  })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional({ example: 'https://furqan.dev/og-image.png' })
  @IsOptional()
  @IsString()
  ogImageUrl?: string;

  @ApiPropertyOptional({
    example: 'Muhammad Furqan Rafique | Full Stack Developer',
  })
  @IsOptional()
  @IsString()
  twitterTitle?: string;

  @ApiPropertyOptional({
    example: 'Scalable SaaS products and modern web experiences.',
  })
  @IsOptional()
  @IsString()
  twitterDescription?: string;

  @ApiPropertyOptional({ example: 'https://furqan.dev/twitter-image.png' })
  @IsOptional()
  @IsString()
  twitterImageUrl?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Prevent search engines from indexing this page.',
  })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;
}
