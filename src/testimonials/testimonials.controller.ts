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
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { ApiTestimonialQuery } from '../common/swagger/api-query.decorators';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { TestimonialQueryDto } from './dto/testimonial-query.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialsService } from './testimonials.service';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('testimonials.read')
  @ApiBearerAuth()
  @ApiTestimonialQuery()
  @ApiOperation({ summary: 'Admin testimonial list' })
  @ApiOkResponse({ description: 'Paginated admin testimonial list.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have testimonials.read permission.',
  })
  findAdmin(@Query() query: TestimonialQueryDto) {
    return this.testimonialsService.findAdmin(query);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('testimonials.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create testimonial' })
  @ApiCreatedResponse({ description: 'Testimonial created successfully.' })
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('testimonials.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Testimonial UUID.',
  })
  @ApiOperation({ summary: 'Update testimonial' })
  @ApiOkResponse({ description: 'Testimonial updated successfully.' })
  @ApiNotFoundResponse({ description: 'Testimonial was not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('testimonials.delete')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Testimonial UUID.',
  })
  @ApiOperation({ summary: 'Archive testimonial' })
  @ApiOkResponse({ description: 'Testimonial archived successfully.' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.testimonialsService.softDelete(id, user.id);
  }

  @Get()
  @ApiTestimonialQuery()
  @ApiOperation({ summary: 'Published testimonial list' })
  @ApiOkResponse({ description: 'Paginated public testimonial list.' })
  findPublished(@Query() query: TestimonialQueryDto) {
    return this.testimonialsService.findPublished(query);
  }
}
