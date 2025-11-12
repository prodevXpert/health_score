import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin_settings')
export class AdminSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // General Settings
  @Column({ name: 'system_name', default: 'HealthScore Bureau' })
  systemName: string;

  @Column({ name: 'support_email', default: 'support@healthscore.com' })
  supportEmail: string;

  @Column({ name: 'max_upload_size', type: 'int', default: 10 })
  maxUploadSize: number;

  @Column({ name: 'default_user_role', default: 'user' })
  defaultUserRole: string;

  // Notification Settings
  @Column({ name: 'email_notifications', default: true })
  emailNotifications: boolean;

  @Column({ name: 'new_user_notifications', default: true })
  newUserNotifications: boolean;

  @Column({ name: 'bulk_upload_notifications', default: true })
  bulkUploadNotifications: boolean;

  @Column({ name: 'system_alerts', default: true })
  systemAlerts: boolean;

  // Security Settings
  @Column({ name: 'session_timeout', type: 'int', default: 30 })
  sessionTimeout: number;

  @Column({ name: 'password_expiry', type: 'int', default: 90 })
  passwordExpiry: number;

  @Column({ name: 'two_factor_auth', default: false })
  twoFactorAuth: boolean;

  @Column({ name: 'ip_whitelist', default: false })
  ipWhitelist: boolean;

  // Data Management Settings
  @Column({ name: 'data_retention', type: 'int', default: 365 })
  dataRetention: number;

  @Column({ name: 'auto_backup', default: true })
  autoBackup: boolean;

  @Column({ name: 'backup_frequency', default: 'daily' })
  backupFrequency: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

