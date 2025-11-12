// Health Data Type Definitions
// Matches backend DTOs exactly

export interface CreateHealthDataDto {
  // Clinical/Vitals - Anthropometry
  height?: number;
  weight?: number;
  waistCircumference?: number;

  // Clinical/Vitals - Blood Pressure
  systolicBP?: number;
  diastolicBP?: number;

  // Clinical/Vitals - Heart & Cardio
  restingHeartRate?: number;
  ecgResult?: string;

  // Laboratory - Glycemic Control
  fastingPlasmaGlucose?: number;
  hba1c?: number;

  // Laboratory - Lipid Profile
  totalCholesterol?: number;
  ldlCholesterol?: number;
  hdlCholesterol?: number;
  triglycerides?: number;

  // Laboratory - Renal Function
  serumCreatinine?: number;
  bun?: number;

  // Laboratory - Liver Function
  alt?: number;
  ast?: number;
  totalBilirubin?: number;

  // Laboratory - Hematology
  hemoglobin?: number;
  wbcCount?: number;
  plateletCount?: number;

  // Laboratory - Thyroid
  tsh?: number;

  // Laboratory - Inflammation
  crp?: number;

  // Laboratory - Vitamins
  vitaminD?: number;
  vitaminB12?: number;

  // Lifestyle & Preventive
  smokingStatus?: string;
  alcoholConsumption?: string;
  physicalActivity?: string;
  dietQuality?: string;
  preventiveCare?: string;
}

export interface HealthDataResponse extends CreateHealthDataDto {
  id: number;
  userId: number;
  bmi?: number;
  egfr?: number;
  totalScore: number;
  clinicalScore: number;
  laboratoryScore: number;
  lifestyleScore: number;
  interpretation: string;
  colorCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreBreakdown {
  totalScore: number;
  maxScore: number;
  interpretation: string;
  colorCode: string;
  categories: {
    clinical: CategoryScore;
    laboratory: CategoryScore;
    lifestyle: CategoryScore;
  };
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  percentage: number;
  subcategories: {
    [key: string]: SubcategoryScore;
  };
}

export interface SubcategoryScore {
  score: number;
  maxScore: number;
  details?: string;
}

export interface UpdateHealthDataDto extends Partial<CreateHealthDataDto> {}

