import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ContentStatus } from '../../generated/prisma';

export class CreateTestimonialDto {
  @ApiProperty({
    example: 'Mock Client',
    description: 'Client or reviewer name.',
  })
  @IsString()
  clientName!: string;

  @ApiPropertyOptional({ example: 'Product Owner' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: 'Future Company' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/client-avatar.png',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'Rating from 1 to 5.',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({
    example: 'Furqan delivered a polished and reliable full-stack solution.',
    description: 'Client feedback text.',
  })
  @IsString()
  review!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Show testimonial in featured sections.',
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
