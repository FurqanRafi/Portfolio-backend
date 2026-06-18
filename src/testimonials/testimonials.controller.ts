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
  @ApiOperation({ summary: 'Admin testimonial list' })
  findAdmin(@Query() query: TestimonialQueryDto) {
    return this.testimonialsService.findAdmin(query);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('testimonials.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create testimonial' })
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('testimonials.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update testimonial' })
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('testimonials.delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive testimonial' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.testimonialsService.softDelete(id, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Published testimonial list' })
  findPublished(@Query() query: TestimonialQueryDto) {
    return this.testimonialsService.findPublished(query);
  }
}
