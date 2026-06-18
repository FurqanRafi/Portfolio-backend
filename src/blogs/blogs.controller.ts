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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { ApiBlogQuery } from '../common/swagger/api-query.decorators';
import { BlogsService } from './blogs.service';
import { BlogQueryDto } from './dto/blog-query.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.read')
  @ApiBearerAuth()
  @ApiBlogQuery()
  @ApiOperation({
    summary: 'Admin blog list',
    description:
      'Protected paginated blog list with status/category/tag filters.',
  })
  @ApiOkResponse({ description: 'Paginated admin blog list.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have blogs.read permission.',
  })
  findAdmin(@Query() query: BlogQueryDto) {
    return this.blogsService.findAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.read')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Blog UUID.',
  })
  @ApiOperation({ summary: 'Admin blog details' })
  @ApiOkResponse({ description: 'Blog detail for admin dashboard.' })
  @ApiNotFoundResponse({ description: 'Blog was not found.' })
  findAdminById(@Param('id') id: string) {
    return this.blogsService.findAdminById(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog' })
  @ApiCreatedResponse({ description: 'Blog created successfully.' })
  create(@Body() dto: CreateBlogDto, @CurrentUser() user: AuthUser) {
    return this.blogsService.create(dto, user.id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Blog UUID.',
  })
  @ApiOperation({ summary: 'Update blog' })
  @ApiOkResponse({ description: 'Blog updated successfully.' })
  @ApiNotFoundResponse({ description: 'Blog was not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogsService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.delete')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Blog UUID.',
  })
  @ApiOperation({ summary: 'Archive blog' })
  @ApiOkResponse({ description: 'Blog archived successfully.' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogsService.softDelete(id, user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Blog categories' })
  @ApiOkResponse({ description: 'Blog category list.' })
  getCategories() {
    return this.blogsService.getCategories();
  }

  @Get('tags')
  @ApiOperation({ summary: 'Blog tags' })
  @ApiOkResponse({ description: 'Blog tag list.' })
  getTags() {
    return this.blogsService.getTags();
  }

  @Get(':slug')
  @ApiParam({
    name: 'slug',
    example: 'building-scalable-saas-products',
    description: 'Published blog slug.',
  })
  @ApiOperation({ summary: 'Published blog details by slug' })
  @ApiOkResponse({ description: 'Published blog detail.' })
  @ApiNotFoundResponse({ description: 'Published blog was not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Get()
  @ApiBlogQuery()
  @ApiOperation({ summary: 'Published blog list' })
  @ApiOkResponse({ description: 'Paginated public blog list.' })
  findPublished(@Query() query: BlogQueryDto) {
    return this.blogsService.findPublished(query);
  }
}
