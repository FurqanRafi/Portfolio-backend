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
import { ApiProjectQuery } from '../common/swagger/api-query.decorators';
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
  @ApiProjectQuery()
  @ApiOperation({
    summary: 'Admin project list',
    description:
      'Protected paginated project list with drafts, published, and archived filters.',
  })
  @ApiOkResponse({ description: 'Paginated admin project list.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have projects.read permission.',
  })
  findAdmin(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.read')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Project UUID.',
  })
  @ApiOperation({ summary: 'Admin project details' })
  @ApiOkResponse({ description: 'Project detail for admin dashboard.' })
  @ApiNotFoundResponse({ description: 'Project was not found.' })
  findAdminById(@Param('id') id: string) {
    return this.projectsService.findAdminById(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({ description: 'Project created successfully.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have projects.create permission.',
  })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthUser) {
    return this.projectsService.create(dto, user.id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('projects.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Project UUID.',
  })
  @ApiOperation({ summary: 'Update project' })
  @ApiOkResponse({ description: 'Project updated successfully.' })
  @ApiNotFoundResponse({ description: 'Project was not found.' })
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
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Project UUID.',
  })
  @ApiOperation({ summary: 'Archive project' })
  @ApiOkResponse({ description: 'Project archived successfully.' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.projectsService.softDelete(id, user.id);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Featured published projects' })
  @ApiOkResponse({
    description: 'Featured published projects for public sections.',
  })
  findFeatured() {
    return this.projectsService.findFeatured();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Project categories' })
  @ApiOkResponse({ description: 'Project category list.' })
  getCategories() {
    return this.projectsService.getCategories();
  }

  @Get('technologies')
  @ApiOperation({ summary: 'Project technologies' })
  @ApiOkResponse({
    description: 'Technology list for project forms and public filters.',
  })
  getTechnologies() {
    return this.projectsService.getTechnologies();
  }

  @Get(':slug')
  @ApiParam({
    name: 'slug',
    example: 'talent-tree-hr',
    description: 'Published project slug.',
  })
  @ApiOperation({ summary: 'Published project details by slug' })
  @ApiOkResponse({ description: 'Published project detail.' })
  @ApiNotFoundResponse({ description: 'Published project was not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get()
  @ApiProjectQuery()
  @ApiOperation({ summary: 'Published project list' })
  @ApiOkResponse({ description: 'Paginated public project list.' })
  findPublished(@Query() query: ProjectQueryDto) {
    return this.projectsService.findPublished(query);
  }
}
