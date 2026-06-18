import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @ApiOperation({ summary: 'Track public analytics event' })
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
  @ApiOperation({ summary: 'Admin analytics event list' })
  findAdmin(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.findAdmin(query);
  }

  @Get('admin/summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin analytics summary' })
  getSummary() {
    return this.analyticsService.getSummary();
  }
}
