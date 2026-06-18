import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@portfolio.local',
    description: 'Admin user email address.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'ChangeMe123!',
    minLength: 8,
    description: 'Admin password. Minimum 8 characters.',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
