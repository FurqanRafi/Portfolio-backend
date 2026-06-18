import { Injectable, NotFoundException } from '@nestjs/common';

import {
  getPagination,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import { toSlug } from '../common/utils/slug.util';
import { ContentStatus, Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const projectInclude = {
  category: true,
  images: {
    orderBy: { displayOrder: 'asc' as const },
  },
  technologies: {
    include: {
      technology: true,
    },
  },
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(query: ProjectQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query, true);

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
        skip,
        take,
      }),
      this.prisma.project.count({ where }),
    ]);

    return toPaginatedResponse(
      projects.map((project) => this.serializeProject(project)),
      total,
      page,
      limit,
    );
  }

  async findAdmin(query: ProjectQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query, false);

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.project.count({ where }),
    ]);

    return toPaginatedResponse(
      projects.map((project) => this.serializeProject(project)),
      total,
      page,
      limit,
    );
  }

  async findFeatured() {
    const projects = await this.prisma.project.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        isFeatured: true,
        deletedAt: null,
      },
      include: projectInclude,
      orderBy: [{ displayOrder: 'asc' }, { publishedAt: 'desc' }],
      take: 6,
    });

    return projects.map((project) => this.serializeProject(project));
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
      include: projectInclude,
    });

    if (!project) {
      throw new NotFoundException('Project was not found.');
    }

    return this.serializeProject(project);
  }

  async findAdminById(id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: projectInclude,
    });

    if (!project) {
      throw new NotFoundException('Project was not found.');
    }

    return this.serializeProject(project);
  }

  getCategories() {
    return this.prisma.projectCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  getTechnologies() {
    return this.prisma.technology.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async create(dto: CreateProjectDto, userId: string) {
    const status = dto.status ?? ContentStatus.DRAFT;
    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        slug: dto.slug ? toSlug(dto.slug) : toSlug(dto.title),
        shortDescription: dto.shortDescription,
        description: dto.description,
        problemStatement: dto.problemStatement,
        solution: dto.solution,
        architecture: dto.architecture,
        results: dto.results,
        lessonsLearned: dto.lessonsLearned,
        thumbnailUrl: dto.thumbnailUrl,
        liveUrl: dto.liveUrl,
        githubUrl: dto.githubUrl,
        categoryId: dto.categoryId,
        status,
        isFeatured: dto.isFeatured ?? false,
        displayOrder: dto.displayOrder ?? 0,
        createdById: userId,
        publishedAt:
          status === ContentStatus.PUBLISHED ? new Date() : undefined,
        technologies: dto.technologyIds?.length
          ? {
              create: dto.technologyIds.map((technologyId) => ({
                technologyId,
              })),
            }
          : undefined,
        images: dto.images?.length
          ? {
              create: dto.images.map((image) => ({
                imageUrl: image.imageUrl,
                altText: image.altText,
                caption: image.caption,
                displayOrder: image.displayOrder ?? 0,
              })),
            }
          : undefined,
      },
      include: projectInclude,
    });

    return this.serializeProject(project);
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    await this.ensureProject(id);

    const data: Prisma.ProjectUpdateInput = {
      title: dto.title,
      slug: dto.slug ? toSlug(dto.slug) : undefined,
      shortDescription: dto.shortDescription,
      description: dto.description,
      problemStatement: dto.problemStatement,
      solution: dto.solution,
      architecture: dto.architecture,
      results: dto.results,
      lessonsLearned: dto.lessonsLearned,
      thumbnailUrl: dto.thumbnailUrl,
      liveUrl: dto.liveUrl,
      githubUrl: dto.githubUrl,
      category: dto.categoryId
        ? { connect: { id: dto.categoryId } }
        : undefined,
      status: dto.status,
      isFeatured: dto.isFeatured,
      displayOrder: dto.displayOrder,
      updatedBy: { connect: { id: userId } },
      publishedAt:
        dto.status === ContentStatus.PUBLISHED ? new Date() : undefined,
    };

    await this.prisma.$transaction(async (tx) => {
      await tx.project.update({ where: { id }, data });

      if (dto.technologyIds) {
        await tx.projectTechnology.deleteMany({ where: { projectId: id } });
        await tx.projectTechnology.createMany({
          data: dto.technologyIds.map((technologyId) => ({
            projectId: id,
            technologyId,
          })),
          skipDuplicates: true,
        });
      }

      if (dto.images) {
        await tx.projectImage.deleteMany({ where: { projectId: id } });
        await tx.projectImage.createMany({
          data: dto.images.map((image) => ({
            projectId: id,
            imageUrl: image.imageUrl,
            altText: image.altText,
            caption: image.caption,
            displayOrder: image.displayOrder ?? 0,
          })),
        });
      }
    });

    return this.findAdminById(id);
  }

  async softDelete(id: string, userId: string) {
    await this.ensureProject(id);

    await this.prisma.project.update({
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
    query: ProjectQueryDto,
    publicOnly: boolean,
  ): Prisma.ProjectWhereInput {
    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
      status: publicOnly ? ContentStatus.PUBLISHED : query.status,
      isFeatured: query.isFeatured,
      category: query.categorySlug ? { slug: query.categorySlug } : undefined,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async ensureProject(id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project was not found.');
    }
  }

  private serializeProject(
    project: Prisma.ProjectGetPayload<{ include: typeof projectInclude }>,
  ) {
    return {
      ...project,
      technologies: project.technologies.map(({ technology }) => technology),
    };
  }
}
