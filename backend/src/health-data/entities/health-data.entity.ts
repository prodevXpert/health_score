import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('health_data')
export class HealthData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.healthData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  testDate: Date;

  // ============ CLINICAL/VITALS DATA (30 points) ============
  
  // A. Anthropometry (10 points)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number; // cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number; // kg

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  waistCircumference: number; // cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bmi: number; // Auto-calculated

  // B. Blood Pressure (10 points)
  @Column({ type: 'int', nullable: true })
  systolicBP: number; // mmHg

  @Column({ type: 'int', nullable: true })
  diastolicBP: number; // mmHg

  // C. Heart & Cardio (10 points)
  @Column({ type: 'int', nullable: true })
  restingHeartRate: number; // bpm

  @Column({ type: 'enum', enum: ['Normal', 'Abnormal', 'Not done'], nullable: true, default: 'Not done' })
  ecgFindings: string;

  // ============ LABORATORY/BIOMARKERS DATA (50 points) ============
  
  // A. Glycemic Control (10 points)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  fastingGlucose: number; // mg/dL

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  hba1c: number; // %

  // B. Lipid Profile (10 points)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalCholesterol: number; // mg/dL

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ldlCholesterol: number; // mg/dL

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hdlCholesterol: number; // mg/dL

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  triglycerides: number; // mg/dL

  // C. Renal Function (6 points)
  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  serumCreatinine: number; // mg/dL

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  egfr: number; // Auto-calculated mL/min/1.73m²

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  urineACR: number; // mg/g

  // D. Liver Function (6 points)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  alt: number; // U/L

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ast: number; // U/L

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  alp: number; // U/L

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  totalBilirubin: number; // mg/dL

  // E. Hematology/CBC (6 points)
  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  hemoglobin: number; // g/dL

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  wbcCount: number; // ×10³/µL

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  plateletCount: number; // ×10³/µL

  // F. Thyroid (4 points)
  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  tsh: number; // mIU/L

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  freeT4: number; // ng/dL

  // G. Inflammation/Cardiac Risk (4 points)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hsCRP: number; // mg/L

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  ntProBNP: number; // pg/mL

  // H. Vitamins/Micronutrients (4 points)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  vitaminD: number; // ng/mL

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  vitaminB12: number; // pg/mL

  @Column({ type: 'enum', enum: ['Normal', 'Abnormal', 'Not done'], nullable: true, default: 'Not done' })
  urinalysisFindings: string;

  // ============ LIFESTYLE & PREVENTIVE DATA (20 points) ============
  
  // A. Smoking & Tobacco (5 points)
  @Column({ 
    type: 'enum', 
    enum: ['Never smoker', 'Former smoker >1 year', 'Former smoker <1 year', 'Current light smoker', 'Current heavy smoker'],
    nullable: true,
    default: 'Never smoker'
  })
  smokingStatus: string;

  // B. Alcohol Use (3 points)
  @Column({ 
    type: 'enum', 
    enum: ['None', 'Low', 'Moderate', 'Heavy'],
    nullable: true,
    default: 'None'
  })
  alcoholUse: string;

  // C. Physical Activity (5 points)
  @Column({ type: 'int', nullable: true, default: 0 })
  physicalActivityMinutes: number; // minutes per week

  // D. Diet Quality (4 points)
  @Column({ type: 'int', nullable: true, default: 0 })
  fruitsVegetablesServings: number; // servings per day

  @Column({ 
    type: 'enum', 
    enum: ['Low', 'Medium', 'High'],
    nullable: true,
    default: 'Medium'
  })
  processedFoodFrequency: string;

  // E. Preventive Care (3 points)
  @Column({ type: 'boolean', default: false })
  screeningsUpToDate: boolean;

  // ============ CALCULATED SCORES ============
  
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  clinicalScore: number; // 0-30

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  labScore: number; // 0-50

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  lifestyleScore: number; // 0-20

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overallScore: number; // 0-100

  @Column({ type: 'enum', enum: ['Excellent', 'Good', 'Fair', 'Needs Attention'], nullable: true })
  scoreInterpretation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

