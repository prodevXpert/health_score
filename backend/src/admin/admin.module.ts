import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CsvParserService } from './services/csv-parser.service';
import { User } from '../users/entities/user.entity';
import { HealthData } from '../health-data/entities/health-data.entity';
import { AdminSettings } from './entities/admin-settings.entity';
import { ScoringModule } from '../scoring/scoring.module';
import { HealthDataModule } from '../health-data/health-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, HealthData, AdminSettings]),
    ScoringModule,
    HealthDataModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, CsvParserService],
  exports: [AdminService],
})
export class AdminModule {}

