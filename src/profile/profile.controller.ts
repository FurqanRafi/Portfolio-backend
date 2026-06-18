import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({
    summary: 'Public profile aggregate for portfolio pages',
    description:
      'Returns profile content, skills, experience, education, featured projects, and testimonials in one call.',
  })
  @ApiOkResponse({ description: 'Public profile aggregate.' })
  getProfile() {
    return this.profileService.getProfile();
  }

  @Get('skills')
  @ApiOperation({ summary: 'Public skills list' })
  @ApiOkResponse({
    description: 'Skills sorted by category and display order.',
  })
  getSkills() {
    return this.profileService.getSkills();
  }

  @Get('experience')
  @ApiOperation({ summary: 'Public experience timeline' })
  @ApiOkResponse({ description: 'Professional experience timeline.' })
  getExperience() {
    return this.profileService.getExperience();
  }

  @Get('education')
  @ApiOperation({ summary: 'Public education list' })
  @ApiOkResponse({ description: 'Education records.' })
  getEducation() {
    return this.profileService.getEducation();
  }
}
