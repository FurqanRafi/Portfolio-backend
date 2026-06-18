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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ApiSeoQuery } from '../common/swagger/api-query.decorators';
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
  @ApiSeoQuery()
  @ApiOperation({ summary: 'Admin SEO metadata list' })
  @ApiOkResponse({ description: 'SEO metadata records.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have seo.read permission.',
  })
  findAdmin(@Query() query: SeoQueryDto) {
    return this.seoService.findAdmin(query);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('seo.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create SEO metadata' })
  @ApiCreatedResponse({ description: 'SEO metadata created successfully.' })
  create(@Body() dto: CreateSeoDto) {
    return this.seoService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('seo.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'SEO metadata UUID.',
  })
  @ApiOperation({ summary: 'Update SEO metadata' })
  @ApiOkResponse({ description: 'SEO metadata updated successfully.' })
  @ApiNotFoundResponse({ description: 'SEO metadata was not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateSeoDto) {
    return this.seoService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('seo.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'SEO metadata UUID.',
  })
  @ApiOperation({ summary: 'Delete SEO metadata' })
  @ApiOkResponse({ description: 'SEO metadata deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.seoService.remove(id);
  }

  @Get(':pageType')
  @ApiParam({
    name: 'pageType',
    example: 'home',
    description: 'Page type or route key.',
  })
  @ApiQuery({
    name: 'pageRefId',
    required: false,
    type: String,
    example: '44444444-4444-4444-8444-444444444444',
    description:
      'Optional entity reference UUID for project/blog-specific SEO.',
  })
  @ApiOperation({ summary: 'Public SEO metadata by page type' })
  @ApiOkResponse({ description: 'Public SEO metadata.' })
  @ApiNotFoundResponse({ description: 'SEO metadata was not found.' })
  findPublic(
    @Param('pageType') pageType: string,
    @Query('pageRefId') pageRefId?: string,
  ) {
    return this.seoService.findPublic(pageType, pageRefId);
  }
}
