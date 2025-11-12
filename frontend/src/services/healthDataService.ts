import api from './api';
import {
  CreateHealthDataDto,
  HealthDataResponse,
  ScoreBreakdown,
  UpdateHealthDataDto,
} from '../types';

/**
 * Health Data Service
 * Handles all health data-related API calls
 */
class HealthDataService {
  /**
   * Create new health data entry
   * POST /health-data
   */
  async createHealthData(data: CreateHealthDataDto): Promise<HealthDataResponse> {
    const response = await api.post<HealthDataResponse>('/health-data', data);
    return response.data;
  }

  /**
   * Get all health data for current user
   * GET /health-data
   */
  async getAllHealthData(): Promise<HealthDataResponse[]> {
    const response = await api.get<HealthDataResponse[]>('/health-data');
    return response.data;
  }

  /**
   * Get latest health data entry
   * GET /health-data/latest
   */
  async getLatestHealthData(): Promise<any> {
    const response = await api.get<any>('/health-data/latest');
    const data = response.data;

    // Map API field names to frontend expected names
    return {
      ...data,
      totalScore: parseFloat(data.overallScore) || 0,
      laboratoryScore: parseFloat(data.labScore) || 0,
      // Parse all numeric fields that come as strings from the database
      clinicalScore: parseFloat(data.clinicalScore) || 0,
      lifestyleScore: parseFloat(data.lifestyleScore) || 0,
      bmi: data.bmi ? parseFloat(data.bmi) : null,
      egfr: data.egfr ? parseFloat(data.egfr) : null,
    };
  }

  /**
   * Get specific health data entry by ID
   * GET /health-data/:id
   */
  async getHealthDataById(id: number): Promise<HealthDataResponse> {
    const response = await api.get<HealthDataResponse>(`/health-data/${id}`);
    return response.data;
  }

  /**
   * Get detailed score breakdown for a health data entry
   * GET /health-data/:id/score-breakdown
   */
  async getScoreBreakdown(id: number): Promise<ScoreBreakdown> {
    const response = await api.get<ScoreBreakdown>(`/health-data/${id}/score-breakdown`);
    return response.data;
  }

  /**
   * Update health data entry
   * PATCH /health-data/:id
   */
  async updateHealthData(id: number, data: UpdateHealthDataDto): Promise<HealthDataResponse> {
    const response = await api.patch<HealthDataResponse>(`/health-data/${id}`, data);
    return response.data;
  }

  /**
   * Delete health data entry
   * DELETE /health-data/:id
   */
  async deleteHealthData(id: number): Promise<void> {
    await api.delete(`/health-data/${id}`);
  }

  /**
   * Calculate BMI from height and weight
   * Formula: weight (kg) / (height (m))^2
   */
  calculateBMI(height: number, weight: number): number {
    if (!height || !weight) return 0;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  /**
   * Calculate eGFR (estimated Glomerular Filtration Rate)
   * Using CKD-EPI equation
   * Note: This is a simplified version. Backend does the actual calculation.
   */
  calculateEGFR(creatinine: number, age: number, gender: string): number {
    if (!creatinine || !age) return 0;
    
    // Simplified calculation (actual formula is more complex)
    const k = gender === 'female' ? 0.7 : 0.9;
    const a = gender === 'female' ? -0.329 : -0.411;
    const genderFactor = gender === 'female' ? 1.018 : 1;
    
    const egfr = 141 * Math.pow(Math.min(creatinine / k, 1), a) * 
                 Math.pow(Math.max(creatinine / k, 1), -1.209) * 
                 Math.pow(0.993, age) * genderFactor;
    
    return parseFloat(egfr.toFixed(2));
  }
}

export default new HealthDataService();

