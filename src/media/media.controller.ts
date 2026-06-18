import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { MediaQueryDto } from './dto/media-query.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @RequirePermissions('media.read')
  @ApiOperation({ summary: 'Admin media library' })
  findAdmin(@Query() query: MediaQueryDto) {
    return this.mediaService.findAdmin(query);
  }

  @Post()
  @RequirePermissions('media.create')
  @ApiOperation({ summary: 'Create media asset record' })
  create(@Body() dto: CreateMediaAssetDto, @CurrentUser() user: AuthUser) {
    return this.mediaService.create(dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('media.delete')
  @ApiOperation({ summary: 'Archive media asset record' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.mediaService.softDelete(id, user.id);
  }
}
