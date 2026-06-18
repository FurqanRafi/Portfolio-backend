import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateMediaAssetDto {
  @ApiProperty({
    example: 'project-cover.png',
    description: 'Original or display file name.',
  })
  @IsString()
  fileName!: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/project-cover.png',
    description: 'Public file URL.',
  })
  @IsString()
  fileUrl!: string;

  @ApiProperty({ example: 'image/png', description: 'MIME type.' })
  @IsString()
  fileType!: string;

  @ApiPropertyOptional({
    example: 184320,
    minimum: 0,
    description: 'File size in bytes.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;

  @ApiPropertyOptional({
    example: 'cloudinary',
    description: 'Storage provider name.',
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({
    example: 'portfolio/projects/project-cover',
    description: 'Provider public ID.',
  })
  @IsOptional()
  @IsString()
  publicId?: string;

  @ApiPropertyOptional({
    example: 'Project cover image',
    description: 'Accessible alt text.',
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({
    example: '99ff717b-5a47-4f6c-83dc-6d2ce62c74c3',
    description: 'Uploader user UUID. Defaults to current admin user.',
  })
  @IsOptional()
  @IsUUID()
  uploadedBy?: string;
}
