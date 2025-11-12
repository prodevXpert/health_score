import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('recommendations')
@Controller('recommendations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recommendations for current user' })
  @ApiResponse({ status: 200, description: 'List of recommendations' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.recommendationsService.findAll(req.user.userId);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate new recommendations based on latest health data' })
  @ApiResponse({ status: 201, description: 'Recommendations generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  generate(@Request() req) {
    return this.recommendationsService.generateRecommendations(req.user.userId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark recommendation as completed' })
  @ApiParam({ name: 'id', description: 'Recommendation ID' })
  @ApiResponse({ status: 200, description: 'Recommendation marked as completed' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  complete(@Request() req, @Param('id') id: string) {
    return this.recommendationsService.markAsCompleted(id, req.user.userId);
  }

  @Post(':id/dismiss')
  @ApiOperation({ summary: 'Dismiss recommendation' })
  @ApiParam({ name: 'id', description: 'Recommendation ID' })
  @ApiResponse({ status: 200, description: 'Recommendation dismissed' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  dismiss(@Request() req, @Param('id') id: string) {
    return this.recommendationsService.dismiss(id, req.user.userId);
  }
}

