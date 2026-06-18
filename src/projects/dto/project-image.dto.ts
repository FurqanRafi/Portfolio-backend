import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProjectImageDto {
  @IsString()
  imageUrl!: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
