import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkHealthDataDto {
  @ApiProperty({ example: 'user-uuid-here', description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '2024-01-15', description: 'Test date (YYYY-MM-DD)' })
  @IsDateString()
  testDate: string;

  // Anthropometry
  @ApiProperty({ example: 170, description: 'Height in cm' })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 70, description: 'Weight in kg' })
  @IsNumber()
  weight: number;

  @ApiPropertyOptional({ example: 85, description: 'Waist circumference in cm' })
  @IsOptional()
  @IsNumber()
  waistCircumference?: number;

  // Blood Pressure
  @ApiPropertyOptional({ example: 120, description: 'Systolic BP in mmHg' })
  @IsOptional()
  @IsNumber()
  systolicBP?: number;

  @ApiPropertyOptional({ example: 80, description: 'Diastolic BP in mmHg' })
  @IsOptional()
  @IsNumber()
  diastolicBP?: number;

  // Heart & Cardio
  @ApiPropertyOptional({ example: 72, description: 'Resting heart rate in bpm' })
  @IsOptional()
  @IsNumber()
  restingHeartRate?: number;

  // Glycemic Control
  @ApiPropertyOptional({ example: 95, description: 'Fasting glucose in mg/dL' })
  @IsOptional()
  @IsNumber()
  fastingGlucose?: number;

  @ApiPropertyOptional({ example: 5.5, description: 'HbA1c in %' })
  @IsOptional()
  @IsNumber()
  hba1c?: number;

  // Lipid Profile
  @ApiPropertyOptional({ example: 180, description: 'Total cholesterol in mg/dL' })
  @IsOptional()
  @IsNumber()
  totalCholesterol?: number;

  @ApiPropertyOptional({ example: 100, description: 'LDL cholesterol in mg/dL' })
  @IsOptional()
  @IsNumber()
  ldlCholesterol?: number;

  @ApiPropertyOptional({ example: 50, description: 'HDL cholesterol in mg/dL' })
  @IsOptional()
  @IsNumber()
  hdlCholesterol?: number;

  @ApiPropertyOptional({ example: 150, description: 'Triglycerides in mg/dL' })
  @IsOptional()
  @IsNumber()
  triglycerides?: number;

  // Renal Function
  @ApiPropertyOptional({ example: 1.0, description: 'Serum creatinine in mg/dL' })
  @IsOptional()
  @IsNumber()
  serumCreatinine?: number;

  @ApiPropertyOptional({ example: 90, description: 'eGFR in mL/min/1.73m²' })
  @IsOptional()
  @IsNumber()
  egfr?: number;

  // Liver Function
  @ApiPropertyOptional({ example: 25, description: 'ALT in U/L' })
  @IsOptional()
  @IsNumber()
  alt?: number;

  @ApiPropertyOptional({ example: 30, description: 'AST in U/L' })
  @IsOptional()
  @IsNumber()
  ast?: number;

  // Hematology
  @ApiPropertyOptional({ example: 14, description: 'Hemoglobin in g/dL' })
  @IsOptional()
  @IsNumber()
  hemoglobin?: number;

  // Thyroid
  @ApiPropertyOptional({ example: 2.5, description: 'TSH in mIU/L' })
  @IsOptional()
  @IsNumber()
  tsh?: number;

  // Inflammation
  @ApiPropertyOptional({ example: 1.5, description: 'CRP in mg/L' })
  @IsOptional()
  @IsNumber()
  crp?: number;

  // Vitamins
  @ApiPropertyOptional({ example: 30, description: 'Vitamin D in ng/mL' })
  @IsOptional()
  @IsNumber()
  vitaminD?: number;

  @ApiPropertyOptional({ example: 400, description: 'Vitamin B12 in pg/mL' })
  @IsOptional()
  @IsNumber()
  vitaminB12?: number;

  // Lifestyle
  @ApiPropertyOptional({ example: 'never', description: 'Smoking status', enum: ['never', 'former', 'current'] })
  @IsOptional()
  @IsEnum(['never', 'former', 'current'])
  smokingStatus?: string;

  @ApiPropertyOptional({ example: 'moderate', description: 'Alcohol consumption', enum: ['none', 'moderate', 'heavy'] })
  @IsOptional()
  @IsEnum(['none', 'moderate', 'heavy'])
  alcoholConsumption?: string;

  @ApiPropertyOptional({ example: 150, description: 'Physical activity in minutes per week' })
  @IsOptional()
  @IsNumber()
  physicalActivityMinutes?: number;

  @ApiPropertyOptional({ example: 'balanced', description: 'Diet quality', enum: ['poor', 'fair', 'balanced', 'excellent'] })
  @IsOptional()
  @IsEnum(['poor', 'fair', 'balanced', 'excellent'])
  dietQuality?: string;

  @ApiPropertyOptional({ example: true, description: 'Annual health checkup completed' })
  @IsOptional()
  annualCheckup?: boolean;
}

export class BulkUploadResultDto {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
  createdRecords: any[];
}

