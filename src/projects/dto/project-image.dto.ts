import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProjectImageDto {
  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/project-cover.png',
    description: 'Project image URL.',
  })
  @IsString()
  imageUrl!: string;

  @ApiPropertyOptional({
    example: 'Talent Tree HR dashboard screen',
    description: 'Accessible alt text for the image.',
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({
    example: 'Admin dashboard overview.',
    description: 'Optional image caption.',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    example: 1,
    minimum: 0,
    description: 'Image display order.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
