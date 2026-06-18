import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { ContentStatus } from '../../generated/prisma';
import { ProjectImageDto } from './project-image.dto';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Talent Tree HR',
    maxLength: 200,
    description: 'Project title shown on public portfolio and admin dashboard.',
  })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'talent-tree-hr',
    maxLength: 220,
    description: 'SEO-friendly slug. If omitted, it is generated from title.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  slug?: string;

  @ApiProperty({
    example: 'Modern HR management platform for employee workflows.',
    description: 'Short card-level project summary.',
  })
  @IsString()
  shortDescription!: string;

  @ApiProperty({
    example:
      'A full-stack HR platform with employee records, attendance, payroll, roles, and admin workflows.',
    description: 'Full project case study description.',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    example: 'Manual HR processes were slow and difficult to track.',
  })
  @IsOptional()
  @IsString()
  problemStatement?: string;

  @ApiPropertyOptional({
    example: 'Built a centralized SaaS dashboard with reusable workflows.',
  })
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiPropertyOptional({
    example: 'Next.js frontend, NestJS API, PostgreSQL database, JWT auth.',
  })
  @IsOptional()
  @IsString()
  architecture?: string;

  @ApiPropertyOptional({
    example: 'Reduced manual HR work and improved workflow visibility.',
  })
  @IsOptional()
  @IsString()
  results?: string;

  @ApiPropertyOptional({
    example: 'Reusable service boundaries made the platform easier to extend.',
  })
  @IsOptional()
  @IsString()
  lessonsLearned?: string;

  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/demo/image/upload/talent-tree-cover.png',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'https://talent-tree.example.com' })
  @IsOptional()
  @IsString()
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/furqan/talent-tree-hr' })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({
    example: '7e3e2ed3-3fd9-4e46-bf75-2d3a3475bca1',
    description: 'Project category UUID.',
  })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
    description: 'Content publishing status.',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    example: true,
    description: 'Show in featured sections.',
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    example: 1,
    minimum: 0,
    description: 'Manual sort order.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['8ab6ebf9-fdb8-4280-9499-f38b2d5d23be'],
    description: 'Technology UUIDs attached to the project.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  technologyIds?: string[];

  @ApiPropertyOptional({
    type: [ProjectImageDto],
    description: 'Project gallery images.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];
}
