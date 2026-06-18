import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateSeoDto } from './dto/create-seo.dto';
import { SeoQueryDto } from './dto/seo-query.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { SeoService } from './seo.service';

@ApiTags('SEO')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('seo.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin SEO metadata list' })
  findAdmin(@Query() query: SeoQueryDto) {
    return this.seoService.findAdmin(query);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('seo.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create SEO metadata' })
  create(@Body() dto: CreateSeoDto) {
    return this.seoService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('seo.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update SEO metadata' })
  update(@Param('id') id: string, @Body() dto: UpdateSeoDto) {
    return this.seoService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('seo.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete SEO metadata' })
  remove(@Param('id') id: string) {
    return this.seoService.remove(id);
  }

  @Get(':pageType')
  @ApiOperation({ summary: 'Public SEO metadata by page type' })
  findPublic(
    @Param('pageType') pageType: string,
    @Query('pageRefId') pageRefId?: string,
  ) {
    return this.seoService.findPublic(pageType, pageRefId);
  }
}
