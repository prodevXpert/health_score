import { Injectable } from '@nestjs/common';
import { HealthData } from '../health-data/entities/health-data.entity';

export interface ScoreBreakdown {
  clinical: {
    total: number;
    anthropometry: number;
    bloodPressure: number;
    heartCardio: number;
  };
  laboratory: {
    total: number;
    glycemic: number;
    lipid: number;
    renal: number;
    liver: number;
    hematology: number;
    thyroid: number;
    inflammation: number;
    vitamins: number;
  };
  lifestyle: {
    total: number;
    smoking: number;
    alcohol: number;
    physicalActivity: number;
    diet: number;
    preventiveCare: number;
  };
  overall: number;
  interpretation: string;
  colorCode: string;
}

@Injectable()
export class ScoringService {
  
  /**
   * Calculate comprehensive health score
   */
  calculateHealthScore(healthData: HealthData, userGender: string, userAge: number): ScoreBreakdown {
    const clinical = this.calculateClinicalScore(healthData, userGender);
    const laboratory = this.calculateLaboratoryScore(healthData, userGender, userAge);
    const lifestyle = this.calculateLifestyleScore(healthData);

    const overall = clinical.total + laboratory.total + lifestyle.total;
    const interpretation = this.getScoreInterpretation(overall);
    const colorCode = this.getColorCode(overall);

    return {
      clinical,
      laboratory,
      lifestyle,
      overall,
      interpretation,
      colorCode,
    };
  }

  /**
   * CLINICAL/VITALS CATEGORY (0-30 points)
   */
  private calculateClinicalScore(healthData: HealthData, userGender: string) {
    const anthropometry = this.scoreAnthropometry(
      healthData.height,
      healthData.weight,
      healthData.waistCircumference,
      userGender
    );
    const bloodPressure = this.scoreBloodPressure(
      healthData.systolicBP,
      healthData.diastolicBP
    );
    const heartCardio = this.scoreHeartCardio(
      healthData.restingHeartRate,
      healthData.ecgFindings
    );

    return {
      total: anthropometry + bloodPressure + heartCardio,
      anthropometry,
      bloodPressure,
      heartCardio,
    };
  }

  /**
   * A. Anthropometry (0-10 points)
   */
  private scoreAnthropometry(
    height: number,
    weight: number,
    waist: number,
    gender: string
  ): number {
    if (!height || !weight) return 0;

    const bmi = weight / Math.pow(height / 100, 2);
    const waistThreshold = gender === 'M' ? 90 : 80;

    let score = 0;

    // BMI scoring (Asian/Indian population standards)
    if (bmi >= 18.5 && bmi <= 22.9) {
      score += 6; // Optimal BMI
    } else if (bmi >= 23 && bmi <= 24.9) {
      score += 4; // Overweight
    } else if (bmi >= 25 && bmi <= 29.9) {
      score += 2; // Obese Class I
    } else {
      score += 0; // Severe obesity or underweight
    }

    // Waist circumference scoring
    if (waist) {
      if (waist < waistThreshold) {
        score += 4; // Below risk threshold
      } else if (waist < waistThreshold + 10) {
        score += 2; // Slightly elevated
      } else {
        score += 0; // Significantly elevated
      }
    } else {
      score += 2; // Partial credit if waist not provided
    }

    return Math.min(score, 10);
  }

  /**
   * B. Blood Pressure (0-10 points)
   */
  private scoreBloodPressure(systolic: number, diastolic: number): number {
    if (!systolic || !diastolic) return 0;

    if (systolic < 120 && diastolic < 80) {
      return 10; // Normal
    } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      return 7; // Elevated
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return 4; // Stage 1 Hypertension
    } else {
      return 0; // Stage 2 Hypertension
    }
  }

  /**
   * C. Heart & Cardio Check (0-10 points)
   */
  private scoreHeartCardio(heartRate: number, ecgFindings: string): number {
    let score = 0;

    if (heartRate) {
      if (heartRate >= 60 && heartRate <= 80) {
        score += 7; // Optimal
      } else if (heartRate > 80 && heartRate <= 100) {
        score += 5; // Normal but not optimal
      } else if (heartRate > 100) {
        score += 2; // Tachycardia
      } else {
        score += 3; // Bradycardia
      }
    }

    if (ecgFindings === 'Normal' || ecgFindings === 'Not done') {
      score += 3;
    } else if (ecgFindings === 'Abnormal') {
      score += 0;
    }

    return Math.min(score, 10);
  }

  /**
   * LABORATORY/BIOMARKERS CATEGORY (0-50 points)
   * Note: Subcategories total 44 points, normalized to 50
   */
  private calculateLaboratoryScore(healthData: HealthData, userGender: string, userAge: number) {
    const glycemic = this.scoreGlycemic(healthData.fastingGlucose, healthData.hba1c);
    const lipid = this.scoreLipid(
      healthData.ldlCholesterol,
      healthData.hdlCholesterol,
      healthData.triglycerides,
      userGender
    );
    const renal = this.scoreRenal(healthData.egfr, healthData.urineACR);
    const liver = this.scoreLiver(healthData.alt, healthData.ast, healthData.alp, healthData.totalBilirubin);
    const hematology = this.scoreHematology(healthData.hemoglobin, healthData.wbcCount, healthData.plateletCount, userGender);
    const thyroid = this.scoreThyroid(healthData.tsh);
    const inflammation = this.scoreInflammation(healthData.hsCRP);
    const vitamins = this.scoreVitamins(healthData.vitaminD, healthData.vitaminB12, healthData.urinalysisFindings);

    // Raw total (out of 44)
    const rawTotal = glycemic + lipid + renal + liver + hematology + thyroid + inflammation + vitamins;

    // Normalize to 50 points
    const normalizedTotal = (rawTotal / 44) * 50;

    return {
      total: Math.round(normalizedTotal * 10) / 10, // Round to 1 decimal
      glycemic,
      lipid,
      renal,
      liver,
      hematology,
      thyroid,
      inflammation,
      vitamins,
    };
  }

  /**
   * A. Glycemic Control (0-10 points)
   */
  private scoreGlycemic(fpg: number, hba1c: number): number {
    let score = 0;

    if (fpg && hba1c) {
      if (fpg < 100 && hba1c < 5.7) {
        score = 10; // Normal
      } else if ((fpg >= 100 && fpg <= 125) || (hba1c >= 5.7 && hba1c <= 6.4)) {
        score = 6; // Prediabetes
      } else {
        score = 2; // Diabetes
      }
    } else if (fpg) {
      if (fpg < 100) score = 10;
      else if (fpg <= 125) score = 6;
      else score = 2;
    } else if (hba1c) {
      if (hba1c < 5.7) score = 10;
      else if (hba1c <= 6.4) score = 6;
      else score = 2;
    }

    return score;
  }

  /**
   * B. Lipid Profile (0-10 points)
   */
  private scoreLipid(ldl: number, hdl: number, tg: number, gender: string): number {
    let score = 0;
    const hdlTarget = gender === 'M' ? 40 : 50;

    // LDL scoring (4 points)
    if (ldl) {
      if (ldl < 100) score += 4;
      else if (ldl < 130) score += 3;
      else if (ldl < 160) score += 2;
      else score += 0;
    }

    // HDL scoring (3 points)
    if (hdl) {
      if (hdl >= hdlTarget) score += 3;
      else score += 1;
    }

    // Triglycerides scoring (3 points)
    if (tg) {
      if (tg < 150) score += 3;
      else if (tg < 200) score += 2;
      else score += 0;
    }

    return Math.min(score, 10);
  }

  /**
   * C. Renal Function (0-6 points)
   */
  private scoreRenal(egfr: number, acr: number): number {
    let score = 0;

    if (egfr) {
      if (egfr >= 90) score += 4;
      else if (egfr >= 60) score += 2;
      else score += 0;
    }

    if (acr) {
      if (acr < 30) score += 2;
      else if (acr <= 300) score += 1;
      else score += 0;
    }

    return Math.min(score, 6);
  }

  /**
   * D. Liver Function (0-4 points)
   */
  private scoreLiver(alt: number, ast: number, alp: number, bilirubin: number): number {
    let abnormalCount = 0;
    let severeCount = 0;

    if (alt) {
      if (alt > 56 * 2) severeCount++;
      else if (alt > 56) abnormalCount++;
    }

    if (ast) {
      if (ast > 40 * 2) severeCount++;
      else if (ast > 40) abnormalCount++;
    }

    if (alp && alp > 120) abnormalCount++;
    if (bilirubin && bilirubin > 1.2) abnormalCount++;

    if (severeCount > 0) return 1;
    if (abnormalCount > 0) return 2;
    return 4;
  }

  /**
   * E. Hematology/CBC (0-4 points)
   */
  private scoreHematology(hb: number, wbc: number, platelets: number, gender: string): number {
    let abnormalCount = 0;
    const hbMin = gender === 'M' ? 13.5 : 12.0;
    const hbMax = gender === 'M' ? 17.5 : 15.5;

    if (hb) {
      if (hb < hbMin - 2 || hb > hbMax + 2) return 0; // Severe
      if (hb < hbMin || hb > hbMax) abnormalCount++;
    }

    if (wbc && (wbc < 4 || wbc > 11)) abnormalCount++;
    if (platelets && (platelets < 150 || platelets > 450)) abnormalCount++;

    if (abnormalCount === 0) return 4;
    if (abnormalCount <= 1) return 2;
    return 0;
  }

  /**
   * F. Thyroid (0-3 points)
   */
  private scoreThyroid(tsh: number): number {
    if (!tsh) return 1.5; // Partial credit if not tested

    if (tsh >= 0.4 && tsh <= 4.0) return 3; // Normal
    if (tsh >= 0.3 && tsh <= 5.0) return 1.5; // Borderline
    return 0; // Abnormal
  }

  /**
   * G. Inflammation/Cardiac Risk (0-3 points)
   */
  private scoreInflammation(hsCRP: number): number {
    if (!hsCRP) return 1.5; // Partial credit if not tested

    if (hsCRP < 1) return 3; // Low risk
    if (hsCRP <= 3) return 1.5; // Moderate risk
    return 0; // High risk
  }

  /**
   * H. Vitamins/Micronutrients (0-4 points)
   */
  private scoreVitamins(vitD: number, vitB12: number, urinalysis: string): number {
    let deficiencies = 0;

    if (vitD && vitD < 20) deficiencies++;
    if (vitB12 && vitB12 < 200) deficiencies++;
    if (urinalysis === 'Abnormal') deficiencies++;

    if (deficiencies === 0) return 4;
    if (deficiencies === 1) return 2;
    return 0;
  }

  /**
   * LIFESTYLE & PREVENTIVE CATEGORY (0-20 points)
   */
  private calculateLifestyleScore(healthData: HealthData) {
    const smoking = this.scoreSmoking(healthData.smokingStatus);
    const alcohol = this.scoreAlcohol(healthData.alcoholUse);
    const physicalActivity = this.scorePhysicalActivity(healthData.physicalActivityMinutes);
    const diet = this.scoreDiet(healthData.fruitsVegetablesServings, healthData.processedFoodFrequency);
    const preventiveCare = this.scorePreventiveCare(healthData.screeningsUpToDate);

    return {
      total: smoking + alcohol + physicalActivity + diet + preventiveCare,
      smoking,
      alcohol,
      physicalActivity,
      diet,
      preventiveCare,
    };
  }

  /**
   * A. Smoking & Tobacco (0-5 points)
   */
  private scoreSmoking(status: string): number {
    switch (status) {
      case 'Never smoker':
      case 'Former smoker >1 year':
        return 5;
      case 'Former smoker <1 year':
        return 3;
      case 'Current light smoker':
        return 2;
      case 'Current heavy smoker':
        return 0;
      default:
        return 5; // Default to never smoker
    }
  }

  /**
   * B. Alcohol Use (0-3 points)
   */
  private scoreAlcohol(use: string): number {
    switch (use) {
      case 'None':
      case 'Low':
        return 3;
      case 'Moderate':
        return 2;
      case 'Heavy':
        return 0;
      default:
        return 3; // Default to none
    }
  }

  /**
   * C. Physical Activity (0-5 points)
   */
  private scorePhysicalActivity(minutes: number): number {
    if (!minutes) return 0;

    if (minutes >= 150) return 5; // Meets WHO recommendations
    if (minutes >= 75) return 3; // Some activity
    if (minutes >= 30) return 2; // Minimal activity
    return 0; // Sedentary
  }

  /**
   * D. Diet Quality (0-4 points)
   */
  private scoreDiet(servings: number, processedFood: string): number {
    let score = 0;

    // Fruits/vegetables servings (2 points)
    if (servings >= 5) score += 2;
    else if (servings >= 3) score += 1;

    // Processed food frequency (2 points)
    if (processedFood === 'Low') score += 2;
    else if (processedFood === 'Medium') score += 1;

    return score;
  }

  /**
   * E. Preventive Care (0-3 points)
   */
  private scorePreventiveCare(upToDate: boolean): number {
    return upToDate ? 3 : 0;
  }

  /**
   * Get score interpretation
   */
  private getScoreInterpretation(score: number): string {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  }

  /**
   * Get color code for UI
   */
  private getColorCode(score: number): string {
    if (score >= 85) return '#0070C0'; // Blue
    if (score >= 70) return '#4CAF50'; // Green
    if (score >= 50) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  /**
   * Calculate BMI
   */
  calculateBMI(height: number, weight: number): number {
    if (!height || !weight) return 0;
    return weight / Math.pow(height / 100, 2);
  }

  /**
   * Calculate eGFR using CKD-EPI equation
   */
  calculateEGFR(creatinine: number, age: number, gender: string): number {
    if (!creatinine || !age) return 0;

    const k = gender === 'F' ? 0.7 : 0.9;
    const a = gender === 'F' ? -0.329 : -0.411;
    const genderFactor = gender === 'F' ? 1.018 : 1;

    const ratio = creatinine / k;
    const minRatio = Math.min(ratio, 1);
    const maxRatio = Math.max(ratio, 1);

    const egfr = 141 * Math.pow(minRatio, a) * Math.pow(maxRatio, -1.209) * Math.pow(0.993, age) * genderFactor;

    return Math.round(egfr * 10) / 10;
  }
}
