import { Injectable, NotFoundException } from '@nestjs/common';

import {
  getPagination,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import {
  AnalyticsEventName,
  ContactMessageStatus,
  Prisma,
} from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageQueryDto } from './dto/message-query.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateMessageDto,
    context: { ipAddress?: string; userAgent?: string },
  ) {
    const message = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        subject: dto.subject,
        message: dto.message,
        source: dto.source ?? 'portfolio_contact_form',
      },
    });

    await this.prisma.analyticsEvent.create({
      data: {
        eventName: AnalyticsEventName.CONTACT_SUBMIT,
        pageUrl: dto.source,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadata: {
          messageId: message.id,
          email: message.email,
        },
      },
    });

    return {
      success: true,
      message: 'Message received successfully.',
      id: message.id,
    };
  }

  async findAdmin(query: MessageQueryDto) {
    const { page, limit, skip, take } = getPagination(query);
    const where = this.buildWhere(query);

    const [messages, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return toPaginatedResponse(messages, total, page, limit);
  }

  async findAdminById(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message was not found.');
    }

    if (!message.isRead) {
      return this.prisma.contactMessage.update({
        where: { id },
        data: { isRead: true, status: ContactMessageStatus.READ },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    }

    return message;
  }

  async update(id: string, dto: UpdateMessageDto) {
    await this.ensureMessage(id);

    return this.prisma.contactMessage.update({
      where: { id },
      data: {
        status: dto.status,
        isRead: dto.isRead,
        assignedTo: dto.assignedToId
          ? { connect: { id: dto.assignedToId } }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.ensureMessage(id);
    await this.prisma.contactMessage.delete({ where: { id } });
    return { success: true };
  }

  private buildWhere(query: MessageQueryDto): Prisma.ContactMessageWhereInput {
    const where: Prisma.ContactMessageWhereInput = {
      status: query.status,
      isRead: query.isRead,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async ensureMessage(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!message) {
      throw new NotFoundException('Message was not found.');
    }
  }
}
