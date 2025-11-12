import { IsNotEmpty, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString, Min, Max } from 'class-validator';

export class CreateHealthDataDto {
  @IsNotEmpty()
  @IsDateString()
  testDate: string;

  // Clinical/Vitals
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weight?: number;

  @IsOptional()
  @IsNumber()
  waistCircumference?: number;

  @IsOptional()
  @IsNumber()
  systolicBP?: number;

  @IsOptional()
  @IsNumber()
  diastolicBP?: number;

  @IsOptional()
  @IsNumber()
  restingHeartRate?: number;

  @IsOptional()
  @IsEnum(['Normal', 'Abnormal', 'Not done'])
  ecgFindings?: string;

  // Laboratory - Glycemic
  @IsOptional()
  @IsNumber()
  fastingGlucose?: number;

  @IsOptional()
  @IsNumber()
  hba1c?: number;

  // Laboratory - Lipid
  @IsOptional()
  @IsNumber()
  totalCholesterol?: number;

  @IsOptional()
  @IsNumber()
  ldlCholesterol?: number;

  @IsOptional()
  @IsNumber()
  hdlCholesterol?: number;

  @IsOptional()
  @IsNumber()
  triglycerides?: number;

  // Laboratory - Renal
  @IsOptional()
  @IsNumber()
  serumCreatinine?: number;

  @IsOptional()
  @IsNumber()
  urineACR?: number;

  // Laboratory - Liver
  @IsOptional()
  @IsNumber()
  alt?: number;

  @IsOptional()
  @IsNumber()
  ast?: number;

  @IsOptional()
  @IsNumber()
  alp?: number;

  @IsOptional()
  @IsNumber()
  totalBilirubin?: number;

  // Laboratory - Hematology
  @IsOptional()
  @IsNumber()
  hemoglobin?: number;

  @IsOptional()
  @IsNumber()
  wbcCount?: number;

  @IsOptional()
  @IsNumber()
  plateletCount?: number;

  // Laboratory - Thyroid
  @IsOptional()
  @IsNumber()
  tsh?: number;

  @IsOptional()
  @IsNumber()
  freeT4?: number;

  // Laboratory - Inflammation
  @IsOptional()
  @IsNumber()
  hsCRP?: number;

  @IsOptional()
  @IsNumber()
  ntProBNP?: number;

  // Laboratory - Vitamins
  @IsOptional()
  @IsNumber()
  vitaminD?: number;

  @IsOptional()
  @IsNumber()
  vitaminB12?: number;

  @IsOptional()
  @IsEnum(['Normal', 'Abnormal', 'Not done'])
  urinalysisFindings?: string;

  // Lifestyle
  @IsOptional()
  @IsEnum(['Never smoker', 'Former smoker >1 year', 'Former smoker <1 year', 'Current light smoker', 'Current heavy smoker'])
  smokingStatus?: string;

  @IsOptional()
  @IsEnum(['None', 'Low', 'Moderate', 'Heavy'])
  alcoholUse?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  physicalActivityMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  fruitsVegetablesServings?: number;

  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  processedFoodFrequency?: string;

  @IsOptional()
  @IsBoolean()
  screeningsUpToDate?: boolean;
}

