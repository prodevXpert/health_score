import { Controller, Get, Patch, Post, Delete, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserPreferencesDto } from './dto/user-preferences.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.update(req.user.userId, updateData);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized or incorrect current password' })
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    await this.usersService.updatePassword(
      req.user.userId,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword
    );

    return { message: 'Password updated successfully' };
  }

  @Delete('account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(@Request() req) {
    await this.usersService.deleteAccount(req.user.userId);
    return { message: 'Account deleted successfully' };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({ status: 200, description: 'User preferences retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPreferences(@Request() req) {
    return this.usersService.getPreferences(req.user.userId);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Save user preferences' })
  @ApiBody({ type: UserPreferencesDto })
  @ApiResponse({ status: 200, description: 'Preferences saved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updatePreferences(@Request() req, @Body() preferencesDto: UserPreferencesDto) {
    return this.usersService.updatePreferences(req.user.userId, preferencesDto);
  }
}

