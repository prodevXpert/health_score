import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class UpdateAdminSettingsDto {
  // General Settings
  @ApiProperty({ required: false, example: 'HealthScore Bureau' })
  @IsOptional()
  @IsString()
  systemName?: string;

  @ApiProperty({ required: false, example: 'support@healthscore.com' })
  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxUploadSize?: number;

  @ApiProperty({ required: false, example: 'user' })
  @IsOptional()
  @IsString()
  @IsIn(['user', 'insurer'])
  defaultUserRole?: string;

  // Notification Settings
  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  newUserNotifications?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  bulkUploadNotifications?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  systemAlerts?: boolean;

  // Security Settings
  @ApiProperty({ required: false, example: 30 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(1440)
  sessionTimeout?: number;

  @ApiProperty({ required: false, example: 90 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  passwordExpiry?: number;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  ipWhitelist?: boolean;

  // Data Management Settings
  @ApiProperty({ required: false, example: 365 })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(3650)
  dataRetention?: number;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  autoBackup?: boolean;

  @ApiProperty({ required: false, example: 'daily' })
  @IsOptional()
  @IsString()
  @IsIn(['hourly', 'daily', 'weekly', 'monthly'])
  backupFrequency?: string;
}

