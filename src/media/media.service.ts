import { Injectable, NotFoundException } from '@nestjs/common';

import {
  getPagination,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import { Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { MediaQueryDto } from './dto/media-query.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAdmin(query: MediaQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query);

    const [assets, total] = await this.prisma.$transaction([
      this.prisma.mediaAsset.findMany({
        where,
        include: {
          uploader: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.mediaAsset.count({ where }),
    ]);

    return toPaginatedResponse(assets, total, page, limit);
  }

  create(dto: CreateMediaAssetDto, userId: string) {
    return this.prisma.mediaAsset.create({
      data: {
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        fileType: dto.fileType,
        fileSize: dto.fileSize,
        provider: dto.provider ?? 'cloudinary',
        publicId: dto.publicId,
        altText: dto.altText,
        uploadedBy: dto.uploadedBy ?? userId,
      },
    });
  }

  async softDelete(id: string, userId: string) {
    await this.ensureAsset(id);

    await this.prisma.mediaAsset.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return { success: true };
  }

  private buildWhere(query: MediaQueryDto): Prisma.MediaAssetWhereInput {
    const where: Prisma.MediaAssetWhereInput = {
      deletedAt: null,
      fileType: query.fileType,
      provider: query.provider,
    };

    if (query.search) {
      where.OR = [
        { fileName: { contains: query.search, mode: 'insensitive' } },
        { altText: { contains: query.search, mode: 'insensitive' } },
        { publicId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async ensureAsset(id: string) {
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!asset) {
      throw new NotFoundException('Media asset was not found.');
    }
  }
}
