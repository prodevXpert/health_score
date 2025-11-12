import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ type: 'int', default: 85 })
  targetHealthScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  targetBMI: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  targetWeight: number;

  @Column({ default: true })
  enableHealthReminders: boolean;

  @Column({ default: 'Monthly' })
  reminderFrequency: string; // Weekly, Monthly, Quarterly

  @Column({ type: 'date', nullable: true })
  nextCheckupDate: Date;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: false })
  smsNotifications: boolean;

  @Column({ default: true })
  inAppNotifications: boolean;

  @Column({ default: true })
  labUploadReminders: boolean;

  @Column({ default: true })
  scoreUpdateNotifications: boolean;

  @Column({ default: true })
  healthInsightsNotifications: boolean;

  @Column({ default: true })
  recommendationsNotifications: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

