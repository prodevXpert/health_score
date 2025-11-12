import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ 
    example: 'city', 
    description: 'Group analytics by field', 
    enum: ['city', 'age', 'gender', 'risk'] 
  })
  @IsOptional()
  @IsEnum(['city', 'age', 'gender', 'risk'])
  groupBy?: string;

  @ApiPropertyOptional({ example: '2024-01-01', description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

