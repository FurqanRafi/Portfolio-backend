import { Injectable, NotFoundException } from '@nestjs/common';

import {
  getPagination,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import { toSlug } from '../common/utils/slug.util';
import { ContentStatus, Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { BlogQueryDto } from './dto/blog-query.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

const blogInclude = {
  category: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
};

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(query: BlogQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query, true);

    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        include: blogInclude,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.blog.count({ where }),
    ]);

    return toPaginatedResponse(
      blogs.map((blog) => this.serializeBlog(blog)),
      total,
      page,
      limit,
    );
  }

  async findAdmin(query: BlogQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query, false);

    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        include: blogInclude,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.blog.count({ where }),
    ]);

    return toPaginatedResponse(
      blogs.map((blog) => this.serializeBlog(blog)),
      total,
      page,
      limit,
    );
  }

  async findBySlug(slug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
      include: blogInclude,
    });

    if (!blog) {
      throw new NotFoundException('Blog was not found.');
    }

    await this.prisma.blog.update({
      where: { id: blog.id },
      data: { viewsCount: { increment: 1 } },
    });

    return this.serializeBlog(blog);
  }

  async findAdminById(id: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
      include: blogInclude,
    });

    if (!blog) {
      throw new NotFoundException('Blog was not found.');
    }

    return this.serializeBlog(blog);
  }

  getCategories() {
    return this.prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
  }

  getTags() {
    return this.prisma.blogTag.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateBlogDto, authorId: string) {
    const status = dto.status ?? ContentStatus.DRAFT;
    const blog = await this.prisma.blog.create({
      data: {
        title: dto.title,
        slug: dto.slug ? toSlug(dto.slug) : toSlug(dto.title),
        excerpt: dto.excerpt,
        content: dto.content,
        thumbnailUrl: dto.thumbnailUrl,
        categoryId: dto.categoryId,
        authorId,
        status,
        readingTime: dto.readingTime,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        publishedAt:
          status === ContentStatus.PUBLISHED ? new Date() : undefined,
        tags: dto.tagIds?.length
          ? {
              create: dto.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      include: blogInclude,
    });

    return this.serializeBlog(blog);
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.ensureBlog(id);

    await this.prisma.$transaction(async (tx) => {
      await tx.blog.update({
        where: { id },
        data: {
          title: dto.title,
          slug: dto.slug ? toSlug(dto.slug) : undefined,
          excerpt: dto.excerpt,
          content: dto.content,
          thumbnailUrl: dto.thumbnailUrl,
          category: dto.categoryId
            ? { connect: { id: dto.categoryId } }
            : undefined,
          status: dto.status,
          readingTime: dto.readingTime,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          publishedAt:
            dto.status === ContentStatus.PUBLISHED ? new Date() : undefined,
        },
      });

      if (dto.tagIds) {
        await tx.blogTagMap.deleteMany({ where: { blogId: id } });
        await tx.blogTagMap.createMany({
          data: dto.tagIds.map((tagId) => ({ blogId: id, tagId })),
          skipDuplicates: true,
        });
      }
    });

    return this.findAdminById(id);
  }

  async softDelete(id: string, userId: string) {
    await this.ensureBlog(id);

    await this.prisma.blog.update({
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
    query: BlogQueryDto,
    publicOnly: boolean,
  ): Prisma.BlogWhereInput {
    const where: Prisma.BlogWhereInput = {
      deletedAt: null,
      status: publicOnly ? ContentStatus.PUBLISHED : query.status,
      category: query.categorySlug ? { slug: query.categorySlug } : undefined,
      tags: query.tagSlug
        ? {
            some: {
              tag: { slug: query.tagSlug },
            },
          }
        : undefined,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async ensureBlog(id: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!blog) {
      throw new NotFoundException('Blog was not found.');
    }
  }

  private serializeBlog(
    blog: Prisma.BlogGetPayload<{ include: typeof blogInclude }>,
  ) {
    return {
      ...blog,
      tags: blog.tags.map(({ tag }) => tag),
    };
  }
}
