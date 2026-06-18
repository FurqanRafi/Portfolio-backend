import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateSeoDto {
  @IsString()
  @MaxLength(100)
  pageType!: string;

  @IsOptional()
  @IsUUID()
  pageRefId?: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @IsOptional()
  @IsString()
  ogTitle?: string;

  @IsOptional()
  @IsString()
  ogDescription?: string;

  @IsOptional()
  @IsString()
  ogImageUrl?: string;

  @IsOptional()
  @IsString()
  twitterTitle?: string;

  @IsOptional()
  @IsString()
  twitterDescription?: string;

  @IsOptional()
  @IsString()
  twitterImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;
}
