import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({
    example: {
      name: 'Muhammad Furqan Rafique',
      title: 'Full Stack Developer',
      heroLine:
        'I build scalable SaaS products, enterprise applications, and modern web experiences using React, Next.js, Node.js, and NestJS.',
    },
    description:
      'JSON setting value. Can be an object, array, string, number, or boolean.',
    oneOf: [
      { type: 'object' },
      { type: 'array' },
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
    ],
  })
  @IsDefined()
  value!: unknown;
}
