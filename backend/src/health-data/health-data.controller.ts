import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { HealthDataService } from './health-data.service';
import { CreateHealthDataDto } from './dto/create-health-data.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('health-data')
@Controller('health-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class HealthDataController {
  constructor(private readonly healthDataService: HealthDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create new health data entry with automatic score calculation' })
  @ApiBody({ type: CreateHealthDataDto })
  @ApiResponse({ status: 201, description: 'Health data created successfully with calculated scores' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() createHealthDataDto: CreateHealthDataDto) {
    return this.healthDataService.create(req.user.userId, createHealthDataDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all health data entries for current user' })
  @ApiResponse({ status: 200, description: 'List of health data entries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.healthDataService.findAll(req.user.userId);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest health data entry for current user' })
  @ApiResponse({ status: 200, description: 'Latest health data entry' })
  @ApiResponse({ status: 404, description: 'No health data found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findLatest(@Request() req) {
    return this.healthDataService.findLatest(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific health data entry by ID' })
  @ApiParam({ name: 'id', description: 'Health data entry ID' })
  @ApiResponse({ status: 200, description: 'Health data entry retrieved' })
  @ApiResponse({ status: 404, description: 'Health data not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.healthDataService.findOne(id, req.user.userId);
  }

  @Get(':id/score-breakdown')
  @ApiOperation({ summary: 'Get detailed score breakdown for a health data entry' })
  @ApiParam({ name: 'id', description: 'Health data entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Detailed score breakdown with all categories and subcategories',
    schema: {
      type: 'object',
      properties: {
        overall: { type: 'number', example: 85 },
        interpretation: { type: 'string', example: 'Excellent' },
        clinical: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 28 },
            anthropometry: { type: 'number', example: 10 },
            bloodPressure: { type: 'number', example: 10 },
            heartCardio: { type: 'number', example: 8 },
          }
        },
        laboratory: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 45 },
            glycemic: { type: 'number', example: 10 },
            lipid: { type: 'number', example: 9 },
            renal: { type: 'number', example: 6 },
            liver: { type: 'number', example: 6 },
            hematology: { type: 'number', example: 6 },
            thyroid: { type: 'number', example: 4 },
            inflammation: { type: 'number', example: 4 },
            vitamins: { type: 'number', example: 0 },
          }
        },
        lifestyle: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 18 },
            smoking: { type: 'number', example: 5 },
            alcohol: { type: 'number', example: 3 },
            physicalActivity: { type: 'number', example: 5 },
            diet: { type: 'number', example: 3 },
            preventiveCare: { type: 'number', example: 2 },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Health data not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getScoreBreakdown(@Request() req, @Param('id') id: string) {
    return this.healthDataService.getScoreBreakdown(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update health data entry (scores will be recalculated)' })
  @ApiParam({ name: 'id', description: 'Health data entry ID' })
  @ApiResponse({ status: 200, description: 'Health data updated successfully' })
  @ApiResponse({ status: 404, description: 'Health data not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateHealthDataDto: Partial<CreateHealthDataDto>,
  ) {
    return this.healthDataService.update(id, req.user.userId, updateHealthDataDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete health data entry' })
  @ApiParam({ name: 'id', description: 'Health data entry ID' })
  @ApiResponse({ status: 200, description: 'Health data deleted successfully' })
  @ApiResponse({ status: 404, description: 'Health data not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Request() req, @Param('id') id: string) {
    return this.healthDataService.remove(id, req.user.userId);
  }
}

