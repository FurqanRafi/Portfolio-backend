import { Injectable } from '@nestjs/common';

import {
  getPagination,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import { Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    dto: CreateAnalyticsEventDto,
    context: { ipAddress?: string; userAgent?: string },
  ) {
    return this.prisma.analyticsEvent.create({
      data: {
        eventName: dto.eventName,
        pageUrl: dto.pageUrl,
        referrer: dto.referrer,
        metadata:
          (dto.metadata as Prisma.InputJsonValue | undefined) ?? undefined,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });
  }

  async findAdmin(query: AnalyticsQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query);

    const [events, total] = await this.prisma.$transaction([
      this.prisma.analyticsEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.analyticsEvent.count({ where }),
    ]);

    return toPaginatedResponse(events, total, page, limit);
  }

  async getSummary() {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [events, recentMessages, topProjects] =
      await this.prisma.$transaction([
        this.prisma.analyticsEvent.findMany({
          where: { createdAt: { gte: since } },
          select: { eventName: true },
        }),
        this.prisma.contactMessage.count({
          where: { createdAt: { gte: since } },
        }),
        this.prisma.project.findMany({
          where: { deletedAt: null },
          select: { id: true, title: true, slug: true, isFeatured: true },
          orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
          take: 5,
        }),
      ]);

    const counts = events.reduce<Record<string, number>>((result, event) => {
      result[event.eventName] = (result[event.eventName] ?? 0) + 1;
      return result;
    }, {});

    return {
      windowDays: 30,
      totalEvents: events.length,
      eventsByName: Object.entries(counts).map(([eventName, count]) => ({
        eventName,
        count,
      })),
      recentMessages,
      topProjects,
    };
  }

  private buildWhere(
    query: AnalyticsQueryDto,
  ): Prisma.AnalyticsEventWhereInput {
    return {
      eventName: query.eventName,
      createdAt:
        query.from || query.to
          ? {
              gte: query.from,
              lte: query.to,
            }
          : undefined,
    };
  }
}
