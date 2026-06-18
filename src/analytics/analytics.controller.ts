import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ApiAnalyticsQuery } from '../common/swagger/api-query.decorators';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track public analytics event' })
  @ApiBody({ type: CreateAnalyticsEventDto })
  @ApiOkResponse({ description: 'Analytics event tracked successfully.' })
  create(@Body() dto: CreateAnalyticsEventDto, @Req() request: Request) {
    return this.analyticsService.create(dto, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Get('admin/events')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.read')
  @ApiBearerAuth()
  @ApiAnalyticsQuery()
  @ApiOperation({ summary: 'Admin analytics event list' })
  @ApiOkResponse({ description: 'Paginated analytics event list.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have analytics.read permission.',
  })
  findAdmin(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.findAdmin(query);
  }

  @Get('admin/summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin analytics summary' })
  @ApiOkResponse({
    description: 'Dashboard analytics summary for the last 30 days.',
  })
  getSummary() {
    return this.analyticsService.getSummary();
  }
}
