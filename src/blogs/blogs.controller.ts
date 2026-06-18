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

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
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
  @ApiOperation({ summary: 'Admin blog list' })
  findAdmin(@Query() query: BlogQueryDto) {
    return this.blogsService.findAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin blog details' })
  findAdminById(@Param('id') id: string) {
    return this.blogsService.findAdminById(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog' })
  create(@Body() dto: CreateBlogDto, @CurrentUser() user: AuthUser) {
    return this.blogsService.create(dto, user.id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogsService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('blogs.delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive blog' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogsService.softDelete(id, user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Blog categories' })
  getCategories() {
    return this.blogsService.getCategories();
  }

  @Get('tags')
  @ApiOperation({ summary: 'Blog tags' })
  getTags() {
    return this.blogsService.getTags();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Published blog details by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Get()
  @ApiOperation({ summary: 'Published blog list' })
  findPublished(@Query() query: BlogQueryDto) {
    return this.blogsService.findPublished(query);
  }
}
