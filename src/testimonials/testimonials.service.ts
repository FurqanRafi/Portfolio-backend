import { Injectable, NotFoundException } from '@nestjs/common';

import {
  getPagination,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import { ContentStatus, Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { TestimonialQueryDto } from './dto/testimonial-query.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(query: TestimonialQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query, true);

    const [testimonials, total] = await this.prisma.$transaction([
      this.prisma.testimonial.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.testimonial.count({ where }),
    ]);

    return toPaginatedResponse(testimonials, total, page, limit);
  }

  async findAdmin(query: TestimonialQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query, false);

    const [testimonials, total] = await this.prisma.$transaction([
      this.prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.testimonial.count({ where }),
    ]);

    return toPaginatedResponse(testimonials, total, page, limit);
  }

  async create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        clientName: dto.clientName,
        designation: dto.designation,
        company: dto.company,
        avatarUrl: dto.avatarUrl,
        rating: dto.rating,
        review: dto.review,
        isFeatured: dto.isFeatured ?? false,
        status: dto.status ?? ContentStatus.DRAFT,
      },
    });
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    await this.ensureTestimonial(id);

    return this.prisma.testimonial.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string, userId: string) {
    await this.ensureTestimonial(id);

    await this.prisma.testimonial.update({
      where: { id },
      data: {
        status: ContentStatus.ARCHIVED,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return { success: true };
  }

  private buildWhere(
    query: TestimonialQueryDto,
    publicOnly: boolean,
  ): Prisma.TestimonialWhereInput {
    const where: Prisma.TestimonialWhereInput = {
      deletedAt: null,
      status: publicOnly ? ContentStatus.PUBLISHED : query.status,
      isFeatured: query.isFeatured,
    };

    if (query.search) {
      where.OR = [
        { clientName: { contains: query.search, mode: 'insensitive' } },
        { company: { contains: query.search, mode: 'insensitive' } },
        { review: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async ensureTestimonial(id: string) {
    const testimonial = await this.prisma.testimonial.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!testimonial) {
      throw new NotFoundException('Testimonial was not found.');
    }
  }
}
