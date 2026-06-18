import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import {
  AnalyticsEventName,
  ContactMessageStatus,
  ContentStatus,
} from '../../generated/prisma';

export function ApiPaginationQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Page number, starting from 1.',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'Items per page. Maximum 100.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      example: 'saas',
      description: 'Optional text search filter.',
    }),
  );
}

export function ApiProjectQuery() {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ContentStatus,
      example: ContentStatus.PUBLISHED,
      description: 'Admin-only content status filter.',
    }),
    ApiQuery({
      name: 'isFeatured',
      required: false,
      type: Boolean,
      example: true,
      description: 'Filter featured projects.',
    }),
    ApiQuery({
      name: 'categorySlug',
      required: false,
      type: String,
      example: 'saas',
      description: 'Filter by project category slug.',
    }),
  );
}

export function ApiBlogQuery() {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ContentStatus,
      example: ContentStatus.PUBLISHED,
      description: 'Admin-only content status filter.',
    }),
    ApiQuery({
      name: 'categorySlug',
      required: false,
      type: String,
      example: 'software-engineering',
      description: 'Filter by blog category slug.',
    }),
    ApiQuery({
      name: 'tagSlug',
      required: false,
      type: String,
      example: 'nextjs',
      description: 'Filter by blog tag slug.',
    }),
  );
}

export function ApiTestimonialQuery() {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ContentStatus,
      example: ContentStatus.PUBLISHED,
      description: 'Admin-only content status filter.',
    }),
    ApiQuery({
      name: 'isFeatured',
      required: false,
      type: Boolean,
      example: true,
      description: 'Filter featured testimonials.',
    }),
  );
}

export function ApiMessageQuery() {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ContactMessageStatus,
      example: ContactMessageStatus.NEW,
      description: 'Filter contact messages by workflow status.',
    }),
    ApiQuery({
      name: 'isRead',
      required: false,
      type: Boolean,
      example: false,
      description: 'Filter contact messages by read state.',
    }),
  );
}

export function ApiAnalyticsQuery() {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'eventName',
      required: false,
      enum: AnalyticsEventName,
      example: AnalyticsEventName.PAGE_VIEW,
      description: 'Filter analytics events by event type.',
    }),
    ApiQuery({
      name: 'from',
      required: false,
      type: String,
      example: '2026-06-01T00:00:00.000Z',
      description: 'Start datetime filter in ISO format.',
    }),
    ApiQuery({
      name: 'to',
      required: false,
      type: String,
      example: '2026-06-30T23:59:59.999Z',
      description: 'End datetime filter in ISO format.',
    }),
  );
}

export function ApiMediaQuery() {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'fileType',
      required: false,
      type: String,
      example: 'image/png',
      description: 'Filter media assets by MIME type.',
    }),
    ApiQuery({
      name: 'provider',
      required: false,
      type: String,
      example: 'cloudinary',
      description: 'Filter media assets by storage provider.',
    }),
  );
}

export function ApiSeoQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'pageRefId',
      required: false,
      type: String,
      example: '44444444-4444-4444-8444-444444444444',
      description:
        'Optional entity reference UUID for entity-specific metadata.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      example: 'home',
      description:
        'Optional text search across page type, title, and description.',
    }),
  );
}
