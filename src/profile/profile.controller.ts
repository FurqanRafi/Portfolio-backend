import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Public profile aggregate for portfolio pages' })
  getProfile() {
    return this.profileService.getProfile();
  }

  @Get('skills')
  @ApiOperation({ summary: 'Public skills list' })
  getSkills() {
    return this.profileService.getSkills();
  }

  @Get('experience')
  @ApiOperation({ summary: 'Public experience timeline' })
  getExperience() {
    return this.profileService.getExperience();
  }

  @Get('education')
  @ApiOperation({ summary: 'Public education list' })
  getEducation() {
    return this.profileService.getEducation();
  }
}
