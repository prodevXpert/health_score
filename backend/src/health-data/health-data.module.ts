import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthDataService } from './health-data.service';
import { HealthDataController } from './health-data.controller';
import { HealthData } from './entities/health-data.entity';
import { User } from '../users/entities/user.entity';
import { ScoringModule } from '../scoring/scoring.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthData, User]),
    ScoringModule,
  ],
  controllers: [HealthDataController],
  providers: [HealthDataService],
  exports: [HealthDataService],
})
export class HealthDataModule {}

