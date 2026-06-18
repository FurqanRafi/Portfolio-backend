import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

import {
  ContentStatus,
  PrismaClient,
  SkillCategory,
  TechnologyCategory,
} from '../src/generated/prisma';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const roles = ['Super Admin', 'Admin', 'Editor', 'Viewer'];

const permissions = [
  ['projects', 'create'],
  ['projects', 'read'],
  ['projects', 'update'],
  ['projects', 'delete'],
  ['projects', 'publish'],
  ['blogs', 'create'],
  ['blogs', 'read'],
  ['blogs', 'update'],
  ['blogs', 'delete'],
  ['blogs', 'publish'],
  ['testimonials', 'create'],
  ['testimonials', 'read'],
  ['testimonials', 'update'],
  ['testimonials', 'delete'],
  ['messages', 'read'],
  ['messages', 'update'],
  ['seo', 'read'],
  ['seo', 'update'],
  ['settings', 'read'],
  ['settings', 'update'],
  ['users', 'create'],
  ['users', 'read'],
  ['users', 'update'],
  ['users', 'delete'],
  ['analytics', 'read'],
  ['media', 'create'],
  ['media', 'read'],
  ['media', 'delete'],
];

const skillSeeds = [
  ['React.js', SkillCategory.FRONTEND, 90],
  ['Next.js', SkillCategory.FRONTEND, 88],
  ['TypeScript', SkillCategory.FRONTEND, 84],
  ['Tailwind CSS', SkillCategory.FRONTEND, 88],
  ['Node.js', SkillCategory.BACKEND, 86],
  ['NestJS', SkillCategory.BACKEND, 82],
  ['Express.js', SkillCategory.BACKEND, 80],
  ['PostgreSQL', SkillCategory.DATABASE, 82],
  ['MongoDB', SkillCategory.DATABASE, 80],
  ['REST APIs', SkillCategory.TOOLS, 86],
  ['GitHub', SkillCategory.TOOLS, 82],
  ['Vercel', SkillCategory.CLOUD, 78],
] as const;

const technologySeeds = [
  ['React.js', TechnologyCategory.FRONTEND],
  ['Next.js', TechnologyCategory.FRONTEND],
  ['TypeScript', TechnologyCategory.FRONTEND],
  ['Tailwind CSS', TechnologyCategory.FRONTEND],
  ['Node.js', TechnologyCategory.BACKEND],
  ['NestJS', TechnologyCategory.BACKEND],
  ['Express.js', TechnologyCategory.BACKEND],
  ['PostgreSQL', TechnologyCategory.DATABASE],
  ['MongoDB', TechnologyCategory.DATABASE],
  ['Prisma', TechnologyCategory.DATABASE],
] as const;

const projectCategories = [
  ['SaaS', 'saas'],
  ['HRM', 'hrm'],
  ['Education', 'education'],
  ['E-Commerce', 'e-commerce'],
  ['Web Application', 'web-application'],
] as const;

const mockProjects = [
  {
    title: 'Talent Tree HR',
    slug: 'talent-tree-hr',
    categorySlug: 'hrm',
    shortDescription: 'Mock HR management platform case study placeholder.',
  },
  {
    title: 'Cognify Education',
    slug: 'cognify-education',
    categorySlug: 'education',
    shortDescription: 'Mock education platform case study placeholder.',
  },
  {
    title: 'BVH Platform',
    slug: 'bvh-platform',
    categorySlug: 'saas',
    shortDescription: 'Mock enterprise SaaS platform case study placeholder.',
  },
  {
    title: 'Drobee Shop',
    slug: 'drobee-shop',
    categorySlug: 'e-commerce',
    shortDescription: 'Mock e-commerce platform case study placeholder.',
  },
];

async function seedRolesAndPermissions() {
  const roleRecords = new Map<string, { id: string }>();

  for (const name of roles) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name} role`,
      },
      select: { id: true },
    });

    roleRecords.set(name, role);
  }

  const permissionRecords: Array<{ id: string }> = [];

  for (const [module, action] of permissions) {
    const key = `${module}.${action}`;

    const permission = await prisma.permission.upsert({
      where: { key },
      update: { module, action },
      create: { key, module, action },
      select: { id: true },
    });

    permissionRecords.push(permission);
  }

  const superAdmin = roleRecords.get('Super Admin');

  if (superAdmin) {
    for (const permission of permissionRecords) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdmin.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdmin.id,
          permissionId: permission.id,
        },
      });
    }
  }

  return roleRecords;
}

async function seedAdminUser(roleRecords: Map<string, { id: string }>) {
  const role = roleRecords.get('Super Admin');

  if (!role) {
    throw new Error('Super Admin role was not created.');
  }

  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.user.upsert({
    where: { email: 'admin@portfolio.local' },
    update: {
      name: 'Muhammad Furqan Rafique',
      roleId: role.id,
      isActive: true,
    },
    create: {
      name: 'Muhammad Furqan Rafique',
      email: 'admin@portfolio.local',
      passwordHash,
      roleId: role.id,
      isActive: true,
    },
  });
}

async function seedProfileContent(adminId: string) {
  await prisma.experience.upsert({
    where: { id: '11111111-1111-4111-8111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-4111-8111-111111111111',
      companyName: 'Preesoft Pvt Ltd',
      roleTitle: 'Associate Full Stack Developer',
      startDate: new Date('2025-12-01'),
      isCurrent: true,
      description:
        'Working on SaaS products, enterprise solutions, and business management platforms.',
      achievements: [
        'Building scalable frontend applications using React.js and Next.js.',
        'Developing backend services and APIs using NestJS and Node.js.',
        'Designing and integrating PostgreSQL database solutions.',
      ],
      technologies: ['React.js', 'Next.js', 'Node.js', 'NestJS', 'PostgreSQL'],
      displayOrder: 1,
    },
  });

  await prisma.experience.upsert({
    where: { id: '22222222-2222-4222-8222-222222222222' },
    update: {},
    create: {
      id: '22222222-2222-4222-8222-222222222222',
      companyName: 'DevsRank Pvt Ltd',
      roleTitle: 'MERN Stack Developer',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-01'),
      isCurrent: false,
      description:
        'Worked on multiple web applications and client projects using the MERN stack.',
      achievements: [
        'Delivered multiple production-ready applications.',
        'Improved application performance through code optimization.',
        'Built reusable UI structures that accelerated development.',
      ],
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
      displayOrder: 2,
    },
  });

  await prisma.education.upsert({
    where: { id: '33333333-3333-4333-8333-333333333333' },
    update: {},
    create: {
      id: '33333333-3333-4333-8333-333333333333',
      instituteName: 'Superior University, Lahore',
      degree: 'Bachelor of Science in Computer Science',
      field: 'Computer Science',
      startDate: new Date('2021-01-01'),
      endDate: new Date('2025-12-31'),
      location: 'Lahore',
      description:
        'Built a foundation in software engineering, web development, database systems, data structures, algorithms, and modern application development practices.',
      displayOrder: 1,
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: 'profile_content' },
    update: {
      value: {
        name: 'Muhammad Furqan Rafique',
        title: 'Full Stack Developer',
        heroLine:
          'I build scalable SaaS products, enterprise applications, and modern web experiences using React, Next.js, Node.js, and NestJS.',
        mission:
          'Build impactful digital products, work on meaningful challenges, and grow into a world-class software engineer capable of creating products used by people around the world.',
      },
    },
    create: {
      key: 'profile_content',
      value: {
        name: 'Muhammad Furqan Rafique',
        title: 'Full Stack Developer',
        heroLine:
          'I build scalable SaaS products, enterprise applications, and modern web experiences using React, Next.js, Node.js, and NestJS.',
        mission:
          'Build impactful digital products, work on meaningful challenges, and grow into a world-class software engineer capable of creating products used by people around the world.',
      },
    },
  });

  await prisma.seoMetadata.upsert({
    where: { id: '44444444-4444-4444-8444-444444444444' },
    update: {},
    create: {
      id: '44444444-4444-4444-8444-444444444444',
      pageType: 'home',
      title: 'Muhammad Furqan Rafique | Full Stack Developer',
      description:
        'Full Stack Developer building scalable SaaS products, enterprise applications, and modern web experiences.',
      ogTitle: 'Muhammad Furqan Rafique | Full Stack Developer',
      ogDescription:
        'Interactive 3D portfolio for SaaS products, enterprise applications, and modern web experiences.',
      twitterTitle: 'Muhammad Furqan Rafique | Full Stack Developer',
      twitterDescription:
        'Scalable SaaS products, enterprise applications, and modern web experiences.',
    },
  });

  return adminId;
}

async function seedSkillsAndTechnologies() {
  for (const [index, [name, category, level]] of skillSeeds.entries()) {
    await prisma.skill.upsert({
      where: {
        id: `50000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
      },
      update: {
        name,
        category,
        level,
        displayOrder: index + 1,
        isFeatured: index < 8,
      },
      create: {
        id: `50000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
        name,
        category,
        level,
        displayOrder: index + 1,
        isFeatured: index < 8,
      },
    });
  }

  const technologies = new Map<string, { id: string }>();

  for (const [name, category] of technologySeeds) {
    const technology = await prisma.technology.upsert({
      where: { name },
      update: { category },
      create: { name, category },
      select: { id: true },
    });

    technologies.set(name, technology);
  }

  return technologies;
}

async function seedMockContent(
  adminId: string,
  technologies: Map<string, { id: string }>,
) {
  const categories = new Map<string, { id: string }>();

  for (const [name, slug] of projectCategories) {
    const category = await prisma.projectCategory.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
      select: { id: true },
    });

    categories.set(slug, category);
  }

  for (const [index, project] of mockProjects.entries()) {
    const category = categories.get(project.categorySlug);

    if (!category) {
      continue;
    }

    const record = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        shortDescription: project.shortDescription,
        categoryId: category.id,
        displayOrder: index + 1,
        isFeatured: index < 3,
      },
      create: {
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        description:
          'Mock project content. Replace this from the admin CMS when final project details, screenshots, metrics, live URLs, and GitHub links are ready.',
        problemStatement: 'Mock problem statement placeholder.',
        solution: 'Mock solution placeholder.',
        architecture: 'Mock architecture placeholder.',
        results: 'Mock results placeholder.',
        lessonsLearned: 'Mock lessons learned placeholder.',
        categoryId: category.id,
        status: ContentStatus.PUBLISHED,
        isFeatured: index < 3,
        displayOrder: index + 1,
        createdById: adminId,
      },
      select: { id: true },
    });

    const technologyNames = ['React.js', 'Next.js', 'TypeScript', 'Node.js'];

    await prisma.projectTechnology.deleteMany({
      where: { projectId: record.id },
    });

    await prisma.projectTechnology.createMany({
      data: technologyNames
        .map((name) => technologies.get(name))
        .filter((technology): technology is { id: string } =>
          Boolean(technology),
        )
        .map((technology) => ({
          projectId: record.id,
          technologyId: technology.id,
        })),
      skipDuplicates: true,
    });
  }

  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: 'software-engineering' },
    update: { name: 'Software Engineering' },
    create: {
      name: 'Software Engineering',
      slug: 'software-engineering',
      description: 'Mock blog category for future articles.',
    },
  });

  await prisma.blog.upsert({
    where: { slug: 'building-scalable-saas-products' },
    update: {},
    create: {
      title: 'Building Scalable SaaS Products',
      slug: 'building-scalable-saas-products',
      excerpt: 'Mock article placeholder for future technical writing.',
      content:
        'Mock blog content. Replace this from the admin CMS when final writing is ready.',
      categoryId: blogCategory.id,
      authorId: adminId,
      status: ContentStatus.PUBLISHED,
      readingTime: 4,
      seoTitle: 'Building Scalable SaaS Products',
      seoDescription: 'Mock article placeholder for future technical writing.',
      publishedAt: new Date(),
    },
  });

  await prisma.testimonial.upsert({
    where: { id: '66666666-6666-4666-8666-666666666666' },
    update: {},
    create: {
      id: '66666666-6666-4666-8666-666666666666',
      clientName: 'Mock Client',
      designation: 'Product Owner',
      company: 'Future Company',
      rating: 5,
      review:
        'Mock testimonial placeholder. Replace with real client feedback from the admin dashboard.',
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
    },
  });
}

async function main() {
  const roleRecords = await seedRolesAndPermissions();
  const admin = await seedAdminUser(roleRecords);
  await seedProfileContent(admin.id);
  const technologies = await seedSkillsAndTechnologies();
  await seedMockContent(admin.id, technologies);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
