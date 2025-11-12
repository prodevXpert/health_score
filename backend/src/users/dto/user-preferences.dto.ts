import { IsNumber, IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserPreferencesDto {
  @ApiProperty({ example: 85, required: false })
  @IsOptional()
  @IsNumber()
  targetHealthScore?: number;

  @ApiProperty({ example: 22.5, required: false })
  @IsOptional()
  @IsNumber()
  targetBMI?: number;

  @ApiProperty({ example: 70, required: false })
  @IsOptional()
  @IsNumber()
  targetWeight?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  enableHealthReminders?: boolean;

  @ApiProperty({ example: 'Monthly', required: false })
  @IsOptional()
  @IsString()
  reminderFrequency?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsDateString()
  nextCheckupDate?: Date;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  inAppNotifications?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  labUploadReminders?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  scoreUpdateNotifications?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  healthInsightsNotifications?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  recommendationsNotifications?: boolean;
}

