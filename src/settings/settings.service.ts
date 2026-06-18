import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

const publicSettingKeys = [
  'profile_content',
  'social_links',
  'contact_channels',
  'availability',
  'site_theme',
];

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicSettings() {
    const settings = await this.prisma.siteSetting.findMany({
      where: { key: { in: publicSettingKeys } },
      orderBy: { key: 'asc' },
    });

    return this.toSettingsObject(settings);
  }

  findAdmin() {
    return this.prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key: string) {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException('Setting was not found.');
    }

    return setting;
  }

  upsert(key: string, dto: UpdateSettingDto) {
    const value = dto.value as Prisma.InputJsonValue;

    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  private toSettingsObject(settings: Array<{ key: string; value: unknown }>) {
    return settings.reduce<Record<string, unknown>>((result, setting) => {
      result[setting.key] = setting.value;
      return result;
    }, {});
  }
}
