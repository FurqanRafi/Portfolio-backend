import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SeoQueryDto {
  @IsOptional()
  @IsUUID()
  pageRefId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
