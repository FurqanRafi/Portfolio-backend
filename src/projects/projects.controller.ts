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
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin project list' })
  findAdmin(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin project details' })
  findAdminById(@Param('id') id: string) {
    return this.projectsService.findAdminById(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create project' })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthUser) {
    return this.projectsService.create(dto, user.id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.update(id, dto, user.id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive project' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.projectsService.softDelete(id, user.id);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Featured published projects' })
  findFeatured() {
    return this.projectsService.findFeatured();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Project categories' })
  getCategories() {
    return this.projectsService.getCategories();
  }

  @Get('technologies')
  @ApiOperation({ summary: 'Project technologies' })
  getTechnologies() {
    return this.projectsService.getTechnologies();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Published project details by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get()
  @ApiOperation({ summary: 'Published project list' })
  findPublished(@Query() query: ProjectQueryDto) {
    return this.projectsService.findPublished(query);
  }
}
