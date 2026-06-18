import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateMediaAssetDto {
  @IsString()
  fileName!: string;

  @IsString()
  fileUrl!: string;

  @IsString()
  fileType!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  publicId?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsUUID()
  uploadedBy?: string;
}
