import {
  Controller,
  Get,
  Delete,
  Patch,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CsvParserService } from './services/csv-parser.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UserFilterDto } from './dto/user-filter.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateAdminSettingsDto } from './dto/update-admin-settings.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly csvParserService: CsvParserService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination and filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAllUsers(@Query() filters: UserFilterDto) {
    return this.adminService.getAllUsers(filters);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get specific user with all health data (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns user details with health data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUserDetails(@Param('id') userId: string) {
    return this.adminService.getUserWithHealthData(userId);
  }

  @Get('users/:id/health-data')
  @ApiOperation({ summary: 'Get all health data for a specific user (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all health records for user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUserHealthData(@Param('id') userId: string) {
    return this.adminService.getUserHealthData(userId);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user and all associated data (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.adminService.updateUserRole(userId, updateRoleDto.role);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get system-wide statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns overall system statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getSystemStats() {
    return this.adminService.getSystemStats();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data with optional grouping (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns analytics data' })
  @ApiResponse({ status: 400, description: 'Invalid groupBy parameter' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.adminService.getAnalytics(query);
  }

  @Post('upload-csv')
  @ApiOperation({ summary: 'Bulk upload health data via CSV (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'CSV uploaded and processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid CSV file or format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    const fileContent = file.buffer.toString('utf-8');
    const parsedData = this.csvParserService.parseHealthDataCsv(fileContent);

    return await this.adminService.bulkCreateHealthData(parsedData);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get admin settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns admin settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update admin settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateSettings(@Body() updateDto: UpdateAdminSettingsDto) {
    return this.adminService.updateSettings(updateDto);
  }

  @Post('export-data')
  @ApiOperation({ summary: 'Export all data (Admin only)' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  async exportAllData() {
    return this.adminService.exportAllData();
  }

  @Post('clear-cache')
  @ApiOperation({ summary: 'Clear system cache (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cache cleared successfully' })
  async clearCache() {
    return this.adminService.clearCache();
  }

  @Post('archive-records')
  @ApiOperation({ summary: 'Archive old records (Admin only)' })
  @ApiResponse({ status: 200, description: 'Records archived successfully' })
  async archiveOldRecords() {
    return this.adminService.archiveOldRecords();
  }
}

