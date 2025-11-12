import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthData } from './entities/health-data.entity';
import { CreateHealthDataDto } from './dto/create-health-data.dto';
import { ScoringService } from '../scoring/scoring.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HealthDataService {
  constructor(
    @InjectRepository(HealthData)
    private healthDataRepository: Repository<HealthData>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private scoringService: ScoringService,
  ) {}

  async create(userId: string, createHealthDataDto: CreateHealthDataDto): Promise<HealthData> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate BMI if height and weight provided
    let bmi = null;
    if (createHealthDataDto.height && createHealthDataDto.weight) {
      bmi = this.scoringService.calculateBMI(createHealthDataDto.height, createHealthDataDto.weight);
    }

    // Calculate eGFR if creatinine provided
    let egfr = null;
    if (createHealthDataDto.serumCreatinine && user.dateOfBirth && user.gender) {
      const age = this.calculateAge(user.dateOfBirth);
      egfr = this.scoringService.calculateEGFR(createHealthDataDto.serumCreatinine, age, user.gender);
    }

    // Create health data entity
    const healthData = this.healthDataRepository.create({
      ...createHealthDataDto,
      userId,
      bmi,
      egfr,
    });

    // Calculate scores
    const age = user.dateOfBirth ? this.calculateAge(user.dateOfBirth) : 30;
    const scoreBreakdown = this.scoringService.calculateHealthScore(healthData, user.gender || 'M', age);

    healthData.clinicalScore = scoreBreakdown.clinical.total;
    healthData.labScore = scoreBreakdown.laboratory.total;
    healthData.lifestyleScore = scoreBreakdown.lifestyle.total;
    healthData.overallScore = scoreBreakdown.overall;
    healthData.scoreInterpretation = scoreBreakdown.interpretation as any;

    return await this.healthDataRepository.save(healthData);
  }

  async findAll(userId: string): Promise<HealthData[]> {
    return await this.healthDataRepository.find({
      where: { userId },
      order: { testDate: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<HealthData> {
    const healthData = await this.healthDataRepository.findOne({
      where: { id, userId },
    });

    if (!healthData) {
      throw new NotFoundException('Health data not found');
    }

    return healthData;
  }

  async findLatest(userId: string): Promise<HealthData> {
    const healthData = await this.healthDataRepository.findOne({
      where: { userId },
      order: { testDate: 'DESC' },
    });

    if (!healthData) {
      throw new NotFoundException('No health data found for this user');
    }

    return healthData;
  }

  async getScoreBreakdown(id: string, userId: string) {
    const healthData = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const age = user.dateOfBirth ? this.calculateAge(user.dateOfBirth) : 30;
    return this.scoringService.calculateHealthScore(healthData, user.gender || 'M', age);
  }

  async update(id: string, userId: string, updateHealthDataDto: Partial<CreateHealthDataDto>): Promise<HealthData> {
    const healthData = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Update BMI if height or weight changed
    if (updateHealthDataDto.height || updateHealthDataDto.weight) {
      const height = updateHealthDataDto.height || healthData.height;
      const weight = updateHealthDataDto.weight || healthData.weight;
      if (height && weight) {
        healthData.bmi = this.scoringService.calculateBMI(height, weight);
      }
    }

    // Update eGFR if creatinine changed
    if (updateHealthDataDto.serumCreatinine && user.dateOfBirth && user.gender) {
      const age = this.calculateAge(user.dateOfBirth);
      healthData.egfr = this.scoringService.calculateEGFR(updateHealthDataDto.serumCreatinine, age, user.gender);
    }

    // Merge updates
    Object.assign(healthData, updateHealthDataDto);

    // Recalculate scores
    const age = user.dateOfBirth ? this.calculateAge(user.dateOfBirth) : 30;
    const scoreBreakdown = this.scoringService.calculateHealthScore(healthData, user.gender || 'M', age);

    healthData.clinicalScore = scoreBreakdown.clinical.total;
    healthData.labScore = scoreBreakdown.laboratory.total;
    healthData.lifestyleScore = scoreBreakdown.lifestyle.total;
    healthData.overallScore = scoreBreakdown.overall;
    healthData.scoreInterpretation = scoreBreakdown.interpretation as any;

    return await this.healthDataRepository.save(healthData);
  }

  async remove(id: string, userId: string): Promise<void> {
    const healthData = await this.findOne(id, userId);
    await this.healthDataRepository.remove(healthData);
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

