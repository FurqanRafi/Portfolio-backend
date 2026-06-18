import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageQueryDto } from './dto/message-query.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit contact message' })
  create(@Body() dto: CreateMessageDto, @Req() request: Request) {
    return this.messagesService.create(dto, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messages.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin message inbox' })
  findAdmin(@Query() query: MessageQueryDto) {
    return this.messagesService.findAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messages.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin message details' })
  findAdminById(@Param('id') id: string) {
    return this.messagesService.findAdminById(id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messages.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update message status/assignment' })
  update(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messagesService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messages.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete message' })
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
