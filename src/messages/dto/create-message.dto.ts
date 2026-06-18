import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Ali Khan',
    maxLength: 150,
    description: 'Sender name.',
  })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiProperty({
    example: 'ali@example.com',
    maxLength: 255,
    description: 'Sender email.',
  })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiPropertyOptional({ example: '+92 300 1234567', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({
    example: 'SaaS project inquiry',
    maxLength: 255,
    description: 'Message subject.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({
    example: 'I want to discuss a SaaS web application project with you.',
    minLength: 10,
    description: 'Contact message body.',
  })
  @IsString()
  @MinLength(10)
  message!: string;

  @ApiPropertyOptional({
    example: 'portfolio_contact_form',
    maxLength: 100,
    description: 'Lead source identifier.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;
}
