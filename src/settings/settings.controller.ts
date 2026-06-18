import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Public site settings' })
  @ApiOkResponse({
    description: 'Public-safe settings object keyed by setting name.',
  })
  getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('settings.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin settings list' })
  @ApiOkResponse({ description: 'All site settings for admin dashboard.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have settings.read permission.',
  })
  findAdmin() {
    return this.settingsService.findAdmin();
  }

  @Get('admin/:key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('settings.read')
  @ApiBearerAuth()
  @ApiParam({
    name: 'key',
    example: 'profile_content',
    description: 'Setting key.',
  })
  @ApiOperation({ summary: 'Admin setting by key' })
  @ApiOkResponse({ description: 'Setting record.' })
  @ApiNotFoundResponse({ description: 'Setting was not found.' })
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put('admin/:key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('settings.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'key',
    example: 'profile_content',
    description: 'Setting key.',
  })
  @ApiBody({ type: UpdateSettingDto })
  @ApiOperation({ summary: 'Create or update setting' })
  @ApiOkResponse({ description: 'Setting created or updated successfully.' })
  upsert(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.upsert(key, dto);
  }
}
