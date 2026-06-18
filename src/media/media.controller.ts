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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { ApiMediaQuery } from '../common/swagger/api-query.decorators';
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
  @ApiMediaQuery()
  @ApiOperation({ summary: 'Admin media library' })
  @ApiOkResponse({ description: 'Paginated media asset list.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have media.read permission.',
  })
  findAdmin(@Query() query: MediaQueryDto) {
    return this.mediaService.findAdmin(query);
  }

  @Post()
  @RequirePermissions('media.create')
  @ApiOperation({ summary: 'Create media asset record' })
  @ApiCreatedResponse({
    description: 'Media asset record created successfully.',
  })
  create(@Body() dto: CreateMediaAssetDto, @CurrentUser() user: AuthUser) {
    return this.mediaService.create(dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('media.delete')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Media asset UUID.',
  })
  @ApiOperation({ summary: 'Archive media asset record' })
  @ApiOkResponse({ description: 'Media asset archived successfully.' })
  @ApiNotFoundResponse({ description: 'Media asset was not found.' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.mediaService.softDelete(id, user.id);
  }
}
