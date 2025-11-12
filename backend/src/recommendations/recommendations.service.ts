import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './entities/recommendation.entity';
import { HealthData } from '../health-data/entities/health-data.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
    @InjectRepository(HealthData)
    private healthDataRepository: Repository<HealthData>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    // Delete existing recommendations for user
    await this.recommendationRepository.delete({ userId });

    // Get latest health data
    const healthData = await this.healthDataRepository.findOne({
      where: { userId },
      order: { testDate: 'DESC' },
    });

    if (!healthData) {
      return [];
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const recommendations: Partial<Recommendation>[] = [];

    // BMI Recommendations
    if (healthData.bmi && healthData.bmi > 25) {
      recommendations.push({
        userId,
        category: 'Diet',
        title: 'Weight Management Program',
        description: 'Your BMI indicates overweight status. Consider consulting a nutritionist for a personalized weight management plan. Focus on portion control and balanced meals.',
        priority: healthData.bmi > 30 ? 'High' : 'Medium',
        relatedMetric: 'BMI',
        currentValue: healthData.bmi.toFixed(1),
      });
    }

    // Blood Pressure Recommendations
    if (healthData.systolicBP && healthData.systolicBP > 130) {
      recommendations.push({
        userId,
        category: 'Routine Checkups',
        title: 'Monitor Blood Pressure Daily',
        description: 'Your blood pressure is elevated. Monitor it daily and reduce sodium intake. Consider the DASH diet and increase physical activity.',
        priority: healthData.systolicBP >= 140 ? 'High' : 'Medium',
        relatedMetric: 'Blood Pressure',
        currentValue: `${healthData.systolicBP}/${healthData.diastolicBP} mmHg`,
      });
    }

    // Glucose/HbA1c Recommendations
    if (healthData.hba1c && healthData.hba1c > 5.7) {
      recommendations.push({
        userId,
        category: 'Diet',
        title: 'Improve Blood Sugar Control',
        description: 'Your HbA1c indicates prediabetes. Schedule diabetes screening, reduce sugar intake, and increase fiber consumption. Consider consulting an endocrinologist.',
        priority: healthData.hba1c >= 6.5 ? 'High' : 'Medium',
        relatedMetric: 'HbA1c',
        currentValue: `${healthData.hba1c.toFixed(1)}%`,
      });
    }

    // LDL Cholesterol Recommendations
    if (healthData.ldlCholesterol && healthData.ldlCholesterol > 130) {
      recommendations.push({
        userId,
        category: 'Diet',
        title: 'Adopt Heart-Healthy Diet',
        description: 'Your LDL cholesterol is elevated. Reduce saturated fats, increase omega-3 fatty acids, and add more fiber to your diet. Consider statins if recommended by your doctor.',
        priority: healthData.ldlCholesterol >= 160 ? 'High' : 'Medium',
        relatedMetric: 'LDL Cholesterol',
        currentValue: `${healthData.ldlCholesterol} mg/dL`,
      });
    }

    // Physical Activity Recommendations
    if (healthData.physicalActivityMinutes && healthData.physicalActivityMinutes < 150) {
      recommendations.push({
        userId,
        category: 'Fitness',
        title: 'Increase Physical Activity',
        description: 'Aim for at least 150 minutes of moderate-intensity aerobic activity per week. Start with brisk walking, swimming, or cycling.',
        priority: healthData.physicalActivityMinutes < 75 ? 'High' : 'Medium',
        relatedMetric: 'Physical Activity',
        currentValue: `${healthData.physicalActivityMinutes} min/week`,
      });
    }

    // Smoking Recommendations
    if (healthData.smokingStatus && healthData.smokingStatus.includes('Current')) {
      recommendations.push({
        userId,
        category: 'Routine Checkups',
        title: 'Enroll in Smoking Cessation Program',
        description: 'Smoking significantly increases health risks. Consider nicotine replacement therapy, counseling, or prescription medications to quit smoking.',
        priority: 'High',
        relatedMetric: 'Smoking Status',
        currentValue: healthData.smokingStatus,
      });
    }

    // Vitamin D Recommendations
    if (healthData.vitaminD && healthData.vitaminD < 20) {
      recommendations.push({
        userId,
        category: 'Diet',
        title: 'Address Vitamin D Deficiency',
        description: 'Your vitamin D level is deficient. Consider supplementation (1000-2000 IU daily) and increase sun exposure (15-20 minutes daily).',
        priority: 'Medium',
        relatedMetric: 'Vitamin D',
        currentValue: `${healthData.vitaminD} ng/mL`,
      });
    }

    // Kidney Function Recommendations
    if (healthData.egfr && healthData.egfr < 60) {
      recommendations.push({
        userId,
        category: 'Routine Checkups',
        title: 'Consult Nephrologist',
        description: 'Your kidney function is reduced. Schedule an appointment with a nephrologist, monitor blood pressure closely, and avoid NSAIDs.',
        priority: 'High',
        relatedMetric: 'eGFR',
        currentValue: `${healthData.egfr.toFixed(1)} mL/min/1.73m²`,
      });
    }

    // Save all recommendations
    const savedRecommendations = await this.recommendationRepository.save(recommendations);
    return savedRecommendations;
  }

  async findAll(userId: string): Promise<Recommendation[]> {
    return await this.recommendationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsCompleted(id: string, userId: string): Promise<Recommendation> {
    const recommendation = await this.recommendationRepository.findOne({
      where: { id, userId },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    recommendation.isCompleted = true;
    return await this.recommendationRepository.save(recommendation);
  }

  async dismiss(id: string, userId: string): Promise<Recommendation> {
    const recommendation = await this.recommendationRepository.findOne({
      where: { id, userId },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    recommendation.isDismissed = true;
    return await this.recommendationRepository.save(recommendation);
  }
}

