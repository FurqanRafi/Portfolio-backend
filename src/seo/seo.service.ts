import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeoDto } from './dto/create-seo.dto';
import { SeoQueryDto } from './dto/seo-query.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(pageType: string, pageRefId?: string) {
    const metadata = await this.prisma.seoMetadata.findFirst({
      where: { pageType, pageRefId: pageRefId ?? null },
      orderBy: { updatedAt: 'desc' },
    });

    if (!metadata) {
      throw new NotFoundException('SEO metadata was not found.');
    }

    return metadata;
  }

  findAdmin(query: SeoQueryDto) {
    const where: Prisma.SeoMetadataWhereInput = {
      pageRefId: query.pageRefId,
    };

    if (query.search) {
      where.OR = [
        { pageType: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.seoMetadata.findMany({
      where,
      orderBy: [{ pageType: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  create(dto: CreateSeoDto) {
    return this.prisma.seoMetadata.create({
      data: {
        pageType: dto.pageType,
        pageRefId: dto.pageRefId,
        title: dto.title,
        description: dto.description,
        keywords: dto.keywords,
        canonicalUrl: dto.canonicalUrl,
        ogTitle: dto.ogTitle,
        ogDescription: dto.ogDescription,
        ogImageUrl: dto.ogImageUrl,
        twitterTitle: dto.twitterTitle,
        twitterDescription: dto.twitterDescription,
        twitterImageUrl: dto.twitterImageUrl,
        noIndex: dto.noIndex ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateSeoDto) {
    await this.ensureSeo(id);
    return this.prisma.seoMetadata.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureSeo(id);
    await this.prisma.seoMetadata.delete({ where: { id } });
    return { success: true };
  }

  private async ensureSeo(id: string) {
    const metadata = await this.prisma.seoMetadata.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!metadata) {
      throw new NotFoundException('SEO metadata was not found.');
    }
  }
}
