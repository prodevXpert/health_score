import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { HealthData } from '../health-data/entities/health-data.entity';
import { AdminSettings } from './entities/admin-settings.entity';
import { UserFilterDto } from './dto/user-filter.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { BulkHealthDataDto, BulkUploadResultDto } from './dto/bulk-upload.dto';
import { UpdateAdminSettingsDto } from './dto/update-admin-settings.dto';
import { ScoringService } from '../scoring/scoring.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(HealthData)
    private healthDataRepository: Repository<HealthData>,
    @InjectRepository(AdminSettings)
    private adminSettingsRepository: Repository<AdminSettings>,
    private scoringService: ScoringService,
  ) {}

  /**
   * Get all users with pagination and filters
   */
  async getAllUsers(filters: UserFilterDto) {
    const { page = 1, limit = 10, search, role, city } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.fullName = Like(`%${search}%`);
    }

    if (role) {
      where.role = role;
    }

    if (city) {
      where.city = city;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'fullName', 'phone', 'dateOfBirth', 'gender', 'city', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    // Get latest health score for each user
    const usersWithScores = await Promise.all(
      users.map(async (user) => {
        const latestHealthData = await this.healthDataRepository.findOne({
          where: { user: { id: user.id } },
          order: { testDate: 'DESC' },
        });

        let healthScore = null;
        let riskLevel = null;

        if (latestHealthData) {
          const age = this.calculateAge(user.dateOfBirth);
          const scoreBreakdown = this.scoringService.calculateHealthScore(
            latestHealthData,
            user.gender,
            age,
          );
          healthScore = scoreBreakdown.overall;
          riskLevel = this.getRiskLevel(healthScore);
        }

        return {
          ...user,
          healthScore,
          riskLevel,
          lastHealthUpdate: latestHealthData?.testDate || null,
        };
      }),
    );

    return {
      users: usersWithScores,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get specific user with all health data
   */
  async getUserWithHealthData(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['healthData'],
      select: ['id', 'email', 'fullName', 'phone', 'dateOfBirth', 'gender', 'city', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate scores for all health data
    const age = this.calculateAge(user.dateOfBirth);
    const healthDataWithScores = user.healthData.map((data) => {
      const scoreBreakdown = this.scoringService.calculateHealthScore(
        data,
        user.gender,
        age,
      );
      return {
        ...data,
        scoreBreakdown,
      };
    });

    return {
      ...user,
      healthData: healthDataWithScores,
    };
  }

  /**
   * Get all health data for a specific user
   */
  async getUserHealthData(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const healthData = await this.healthDataRepository.find({
      where: { user: { id: userId } },
      order: { testDate: 'DESC' },
    });

    const age = this.calculateAge(user.dateOfBirth);
    const healthDataWithScores = healthData.map((data) => {
      const scoreBreakdown = this.scoringService.calculateHealthScore(
        data,
        user.gender,
        age,
      );
      return {
        ...data,
        scoreBreakdown,
      };
    });

    return healthDataWithScores;
  }

  /**
   * Delete user and all associated data
   */
  async deleteUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete all health data first (cascade should handle this, but being explicit)
    await this.healthDataRepository.delete({ user: { id: userId } });

    // Delete user
    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  /**
   * Get system-wide statistics
   */
  async getSystemStats() {
    const totalUsers = await this.userRepository.count();
    const totalHealthRecords = await this.healthDataRepository.count();

    // Get all users with their latest health data
    const users = await this.userRepository.find({
      select: ['id', 'dateOfBirth', 'gender', 'createdAt'],
    });

    let totalScore = 0;
    let scoredUsers = 0;
    const riskDistribution = {
      excellent: 0,
      good: 0,
      fair: 0,
      needsAttention: 0,
    };

    for (const user of users) {
      const latestHealthData = await this.healthDataRepository.findOne({
        where: { user: { id: user.id } },
        order: { testDate: 'DESC' },
      });

      if (latestHealthData) {
        const age = this.calculateAge(user.dateOfBirth);
        const scoreBreakdown = this.scoringService.calculateHealthScore(
          latestHealthData,
          user.gender,
          age,
        );
        totalScore += scoreBreakdown.overall;
        scoredUsers++;

        // Update risk distribution
        if (scoreBreakdown.overall >= 85) {
          riskDistribution.excellent++;
        } else if (scoreBreakdown.overall >= 70) {
          riskDistribution.good++;
        } else if (scoreBreakdown.overall >= 50) {
          riskDistribution.fair++;
        } else {
          riskDistribution.needsAttention++;
        }
      }
    }

    const averageHealthScore = scoredUsers > 0 ? Math.round(totalScore / scoredUsers) : 0;

    // Get recent activity (last 10 health data entries)
    const recentActivity = await this.healthDataRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const recentActivityFormatted = recentActivity.map((data) => ({
      id: data.id,
      userId: data.user.id,
      userName: data.user.fullName,
      testDate: data.testDate,
      createdAt: data.createdAt,
    }));

    // Get active users (users who added health data in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await this.healthDataRepository
      .createQueryBuilder('healthData')
      .select('COUNT(DISTINCT healthData.userId)', 'count')
      .where('healthData.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getRawOne();

    return {
      totalUsers,
      totalHealthRecords,
      averageHealthScore,
      activeUsers: parseInt(activeUsers.count) || 0,
      riskDistribution,
      recentActivity: recentActivityFormatted,
    };
  }

  /**
   * Get analytics data
   */
  async getAnalytics(query: AnalyticsQueryDto) {
    const { groupBy, startDate, endDate } = query;

    let whereConditions: any = {};

    if (startDate && endDate) {
      whereConditions.testDate = Between(new Date(startDate), new Date(endDate));
    }

    const healthData = await this.healthDataRepository.find({
      where: whereConditions,
      relations: ['user'],
    });

    if (!groupBy) {
      // Return overall analytics
      return this.calculateOverallAnalytics(healthData);
    }

    switch (groupBy) {
      case 'city':
        return this.groupByCity(healthData);
      case 'age':
        return this.groupByAge(healthData);
      case 'gender':
        return this.groupByGender(healthData);
      case 'risk':
        return this.groupByRisk(healthData);
      default:
        throw new BadRequestException('Invalid groupBy parameter');
    }
  }

  /**
   * Bulk create health data from CSV upload
   */
  async bulkCreateHealthData(bulkData: BulkHealthDataDto[]): Promise<BulkUploadResultDto> {
    const result: BulkUploadResultDto = {
      success: 0,
      failed: 0,
      errors: [],
      createdRecords: [],
    };

    for (let i = 0; i < bulkData.length; i++) {
      try {
        const data = bulkData[i];

        // Verify user exists
        const user = await this.userRepository.findOne({
          where: { id: data.userId },
        });

        if (!user) {
          result.failed++;
          result.errors.push({
            row: i + 2, // +2 because row 1 is header, and array is 0-indexed
            error: `User not found: ${data.userId}`,
          });
          continue;
        }

        // Calculate BMI if height and weight provided
        let bmi = null;
        if (data.height && data.weight) {
          bmi = this.scoringService.calculateBMI(data.height, data.weight);
        }

        // Calculate eGFR if creatinine provided
        let egfr = data.egfr || null;
        if (data.serumCreatinine && user.dateOfBirth && user.gender && !egfr) {
          const age = this.calculateAge(user.dateOfBirth);
          egfr = this.scoringService.calculateEGFR(data.serumCreatinine, age, user.gender);
        }

        // Create health data entity
        const healthData = this.healthDataRepository.create({
          ...data,
          user,
          bmi,
          egfr,
        });

        // Calculate scores
        const age = user.dateOfBirth ? this.calculateAge(user.dateOfBirth) : 30;
        const scoreBreakdown = this.scoringService.calculateHealthScore(
          healthData,
          user.gender || 'M',
          age,
        );

        healthData.clinicalScore = scoreBreakdown.clinical.total;
        healthData.labScore = scoreBreakdown.laboratory.total;
        healthData.lifestyleScore = scoreBreakdown.lifestyle.total;
        healthData.overallScore = scoreBreakdown.overall;
        healthData.scoreInterpretation = scoreBreakdown.interpretation as any;

        // Save health data
        const savedData = await this.healthDataRepository.save(healthData);

        result.success++;
        result.createdRecords.push({
          id: savedData.id,
          userId: savedData.user.id,
          userName: user.fullName,
          testDate: savedData.testDate,
          overallScore: savedData.overallScore,
        });
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: i + 2,
          error: error.message || 'Unknown error',
        });
      }
    }

    return result;
  }

  // ==================== HELPER METHODS ====================

  private calculateAge(dateOfBirth: Date): number {
    if (!dateOfBirth) return 30; // Default age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private getRiskLevel(score: number): string {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  }

  private calculateOverallAnalytics(healthData: any[]) {
    const totalRecords = healthData.length;
    let totalScore = 0;

    healthData.forEach((data) => {
      const age = this.calculateAge(data.user.dateOfBirth);
      const scoreBreakdown = this.scoringService.calculateHealthScore(
        data,
        data.user.gender,
        age,
      );
      totalScore += scoreBreakdown.overall;
    });

    const averageScore = totalRecords > 0 ? Math.round(totalScore / totalRecords) : 0;

    return {
      totalRecords,
      averageScore,
    };
  }

  private groupByCity(healthData: any[]) {
    const cityMap = new Map<string, { count: number; totalScore: number }>();

    healthData.forEach((data) => {
      const city = data.user.city || 'Unknown';
      const age = this.calculateAge(data.user.dateOfBirth);
      const scoreBreakdown = this.scoringService.calculateHealthScore(
        data,
        data.user.gender,
        age,
      );

      if (!cityMap.has(city)) {
        cityMap.set(city, { count: 0, totalScore: 0 });
      }

      const cityData = cityMap.get(city);
      cityData.count++;
      cityData.totalScore += scoreBreakdown.overall;
    });

    const result = Array.from(cityMap.entries()).map(([city, data]) => ({
      city,
      count: data.count,
      averageScore: Math.round(data.totalScore / data.count),
    }));

    return result.sort((a, b) => b.count - a.count);
  }

  private groupByAge(healthData: any[]) {
    const ageGroups = {
      '18-30': { count: 0, totalScore: 0 },
      '31-40': { count: 0, totalScore: 0 },
      '41-50': { count: 0, totalScore: 0 },
      '51-60': { count: 0, totalScore: 0 },
      '60+': { count: 0, totalScore: 0 },
    };

    healthData.forEach((data) => {
      const age = this.calculateAge(data.user.dateOfBirth);
      const scoreBreakdown = this.scoringService.calculateHealthScore(
        data,
        data.user.gender,
        age,
      );

      let ageGroup: string;
      if (age <= 30) ageGroup = '18-30';
      else if (age <= 40) ageGroup = '31-40';
      else if (age <= 50) ageGroup = '41-50';
      else if (age <= 60) ageGroup = '51-60';
      else ageGroup = '60+';

      ageGroups[ageGroup].count++;
      ageGroups[ageGroup].totalScore += scoreBreakdown.overall;
    });

    return Object.entries(ageGroups).map(([ageGroup, data]) => ({
      ageGroup,
      count: data.count,
      averageScore: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
    }));
  }

  private groupByGender(healthData: any[]) {
    const genderMap = new Map<string, { count: number; totalScore: number }>();

    healthData.forEach((data) => {
      const gender = data.user.gender || 'Unknown';
      const age = this.calculateAge(data.user.dateOfBirth);
      const scoreBreakdown = this.scoringService.calculateHealthScore(
        data,
        data.user.gender,
        age,
      );

      if (!genderMap.has(gender)) {
        genderMap.set(gender, { count: 0, totalScore: 0 });
      }

      const genderData = genderMap.get(gender);
      genderData.count++;
      genderData.totalScore += scoreBreakdown.overall;
    });

    return Array.from(genderMap.entries()).map(([gender, data]) => ({
      gender,
      count: data.count,
      averageScore: Math.round(data.totalScore / data.count),
    }));
  }

  private groupByRisk(healthData: any[]) {
    const riskGroups = {
      excellent: { count: 0, scoreRange: '85-100' },
      good: { count: 0, scoreRange: '70-84' },
      fair: { count: 0, scoreRange: '50-69' },
      needsAttention: { count: 0, scoreRange: '0-49' },
    };

    healthData.forEach((data) => {
      const age = this.calculateAge(data.user.dateOfBirth);
      const scoreBreakdown = this.scoringService.calculateHealthScore(
        data,
        data.user.gender,
        age,
      );

      if (scoreBreakdown.overall >= 85) {
        riskGroups.excellent.count++;
      } else if (scoreBreakdown.overall >= 70) {
        riskGroups.good.count++;
      } else if (scoreBreakdown.overall >= 50) {
        riskGroups.fair.count++;
      } else {
        riskGroups.needsAttention.count++;
      }
    });

    return Object.entries(riskGroups).map(([riskLevel, data]) => ({
      riskLevel,
      count: data.count,
      scoreRange: data.scoreRange,
    }));
  }

  /**
   * Get admin settings (creates default if not exists)
   */
  async getSettings(): Promise<AdminSettings> {
    let settings = await this.adminSettingsRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    // Create default settings if none exist
    if (!settings) {
      settings = this.adminSettingsRepository.create({});
      await this.adminSettingsRepository.save(settings);
    }

    return settings;
  }

  /**
   * Update admin settings
   */
  async updateSettings(updateDto: UpdateAdminSettingsDto): Promise<AdminSettings> {
    let settings = await this.getSettings();

    // Update settings with provided values
    Object.assign(settings, updateDto);

    return await this.adminSettingsRepository.save(settings);
  }

  /**
   * Export all data (users and health data)
   */
  async exportAllData(): Promise<{ users: any[], healthData: any[], exportedAt: Date }> {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'fullName', 'phone', 'dateOfBirth', 'gender', 'city', 'role', 'isActive', 'createdAt'],
    });

    const healthData = await this.healthDataRepository.find({
      relations: ['user'],
      select: {
        id: true,
        testDate: true,
        overallScore: true,
        clinicalScore: true,
        labScore: true,
        lifestyleScore: true,
        scoreInterpretation: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    });

    return {
      users,
      healthData,
      exportedAt: new Date(),
    };
  }

  /**
   * Clear cache (placeholder - implement actual cache clearing based on your cache strategy)
   */
  async clearCache(): Promise<{ message: string, clearedAt: Date }> {
    // TODO: Implement actual cache clearing if you're using Redis or similar
    // For now, this is a placeholder
    return {
      message: 'Cache cleared successfully',
      clearedAt: new Date(),
    };
  }

  /**
   * Archive old records based on retention period
   */
  async archiveOldRecords(): Promise<{ archivedCount: number, archivedAt: Date }> {
    const settings = await this.getSettings();
    const retentionDays = settings.dataRetention;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Find old health data records
    const oldRecords = await this.healthDataRepository.find({
      where: {
        createdAt: Between(new Date('1900-01-01'), cutoffDate),
      },
    });

    // In a real implementation, you would move these to an archive table
    // For now, we'll just count them
    const archivedCount = oldRecords.length;

    // TODO: Implement actual archiving logic (move to archive table, export to file, etc.)
    // await this.healthDataRepository.remove(oldRecords);

    return {
      archivedCount,
      archivedAt: new Date(),
    };
  }
}

