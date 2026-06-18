import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
  getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('settings.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin settings list' })
  findAdmin() {
    return this.settingsService.findAdmin();
  }

  @Get('admin/:key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('settings.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin setting by key' })
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put('admin/:key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('settings.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update setting' })
  upsert(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.upsert(key, dto);
  }
}
