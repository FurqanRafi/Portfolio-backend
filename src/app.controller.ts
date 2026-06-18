import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API health check',
    description:
      'Returns a simple health response for uptime checks and root API verification.',
  })
  @ApiOkResponse({
    description: 'API is running.',
    schema: {
      example: {
        status: 'ok',
        message: 'Portfolio API is running',
        timestamp: '2026-06-18T12:00:00.000Z',
        version: '1.0.0',
      },
    },
  })
  getHealth(): object {
    return this.appService.getHealth();
  }
}
