import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ApiMessageQuery } from '../common/swagger/api-query.decorators';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageQueryDto } from './dto/message-query.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit contact message',
    description:
      'Public contact form endpoint. Creates a lead message and tracks CONTACT_SUBMIT analytics.',
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiOkResponse({
    description: 'Message received successfully.',
    schema: {
      example: {
        success: true,
        message: 'Message received successfully.',
        id: '3b3a9f24-6761-4c35-b095-a8d8d5b8561e',
      },
    },
  })
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
  @ApiMessageQuery()
  @ApiOperation({ summary: 'Admin message inbox' })
  @ApiOkResponse({ description: 'Paginated contact message inbox.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiForbiddenResponse({
    description: 'Admin does not have messages.read permission.',
  })
  findAdmin(@Query() query: MessageQueryDto) {
    return this.messagesService.findAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messages.read')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Message UUID.',
  })
  @ApiOperation({ summary: 'Admin message details' })
  @ApiOkResponse({
    description: 'Message detail. Marks unread messages as read.',
  })
  @ApiNotFoundResponse({ description: 'Message was not found.' })
  findAdminById(@Param('id') id: string) {
    return this.messagesService.findAdminById(id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messages.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Message UUID.',
  })
  @ApiOperation({ summary: 'Update message status/assignment' })
  @ApiOkResponse({ description: 'Message updated successfully.' })
  @ApiNotFoundResponse({ description: 'Message was not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messagesService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messages.update')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Message UUID.',
  })
  @ApiOperation({ summary: 'Delete message' })
  @ApiOkResponse({ description: 'Message deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
