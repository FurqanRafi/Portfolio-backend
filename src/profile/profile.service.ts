import { Injectable } from '@nestjs/common';

import { ContentStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile() {
    const [
      profileContent,
      skills,
      experiences,
      education,
      featuredProjects,
      testimonials,
    ] = await this.prisma.$transaction([
      this.prisma.siteSetting.findUnique({
        where: { key: 'profile_content' },
      }),
      this.prisma.skill.findMany({
        orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
      }),
      this.prisma.experience.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      this.prisma.education.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      this.prisma.project.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          isFeatured: true,
          deletedAt: null,
        },
        include: {
          category: true,
          technologies: { include: { technology: true } },
        },
        orderBy: [{ displayOrder: 'asc' }, { publishedAt: 'desc' }],
        take: 3,
      }),
      this.prisma.testimonial.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          isFeatured: true,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ]);

    return {
      profile: profileContent?.value ?? null,
      skills,
      experiences,
      education,
      featuredProjects: featuredProjects.map((project) => ({
        ...project,
        technologies: project.technologies.map(({ technology }) => technology),
      })),
      testimonials,
    };
  }

  getSkills() {
    return this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
    });
  }

  getExperience() {
    return this.prisma.experience.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  getEducation() {
    return this.prisma.education.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }
}
