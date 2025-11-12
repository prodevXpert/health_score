import { Box, Card, CardContent, Grid, LinearProgress, Stack, Typography, Chip, Alert, CircularProgress, Button } from '@mui/material';
import GaugeCard from 'components/GaugeCard';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { healthDataService } from 'services';
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Helper functions defined outside component to avoid re-creation
const getScoreColor = (score) => {
  if (score >= 85) return '#2196F3'; // Blue - Excellent
  if (score >= 70) return '#4CAF50'; // Green - Good
  if (score >= 50) return '#FF9800'; // Orange - Fair
  return '#F44336'; // Red - Needs Attention
};

const getInterpretation = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Attention';
};

const getRiskColor = (interpretation) => {
  switch (interpretation) {
    case 'Excellent':
      return 'info';
    case 'Good':
      return 'success';
    case 'Fair':
      return 'warning';
    case 'Needs Attention':
      return 'error';
    default:
      return 'default';
  }
};

export default function MyHealthScorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const data = await healthDataService.getLatestHealthData();
        setHealthData(data);
        setError('');
      } catch (err) {
        console.error('Error fetching health data:', err);
        if (err.response?.status === 404) {
          setHealthData(null);
        } else {
          setError('Failed to load health data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!healthData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          My Health Score
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          No health data found. Click "Add Health Data" to get started and receive your comprehensive health score!
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/health-data')}
          sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
        >
          Add Health Data
        </Button>
      </Box>
    );
  }

  const interpretation = getInterpretation(healthData.totalScore);

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              My Health Score
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Your comprehensive health assessment and metrics
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/health-data')}
          >
            Update Health Data
          </Button>
        </Box>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {/* User Info Card */}
      <Grid size={12}>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {user?.fullName || 'User'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.age} years • {user?.gender} • BMI: {healthData.bmi?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>
              <Chip label={`Health Status: ${interpretation}`} color={getRiskColor(interpretation)} size="large" sx={{ fontWeight: 600 }} />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Overall Health Score */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Stack spacing={2} sx={{ alignItems: 'center', py: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Overall Health Score
            </Typography>
            <Box
              sx={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getScoreColor(healthData.totalScore)} 0%, ${getScoreColor(healthData.totalScore)}99 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  {healthData.totalScore.toFixed(1)}
                </Typography>
                <Typography variant="body2">out of 100</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Last updated: {new Date(healthData.createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
        </MainCard>
      </Grid>

      {/* Score Breakdown */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Score Breakdown">
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Clinical & Vitals
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: getScoreColor((healthData.clinicalScore / 30) * 100) }}>
                  {healthData.clinicalScore.toFixed(1)}/30
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(healthData.clinicalScore / 30) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getScoreColor((healthData.clinicalScore / 30) * 100),
                    borderRadius: 5
                  }
                }}
              />
            </Box>

            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Laboratory Tests
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: getScoreColor((healthData.laboratoryScore / 50) * 100) }}>
                  {healthData.laboratoryScore.toFixed(1)}/50
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(healthData.laboratoryScore / 50) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getScoreColor((healthData.laboratoryScore / 50) * 100),
                    borderRadius: 5
                  }
                }}
              />
            </Box>

            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Lifestyle & Preventive
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: getScoreColor((healthData.lifestyleScore / 20) * 100) }}>
                  {healthData.lifestyleScore.toFixed(1)}/20
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(healthData.lifestyleScore / 20) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getScoreColor((healthData.lifestyleScore / 20) * 100),
                    borderRadius: 5
                  }
                }}
              />
            </Box>
          </Stack>
        </MainCard>
      </Grid>

      {/* Detailed Metrics */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <GaugeCard
          title="Clinical & Vitals"
          value={healthData.clinicalScore.toFixed(1)}
          maxValue={30}
          color={getScoreColor((healthData.clinicalScore / 30) * 100)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <GaugeCard
          title="Laboratory Tests"
          value={healthData.laboratoryScore.toFixed(1)}
          maxValue={50}
          color={getScoreColor((healthData.laboratoryScore / 50) * 100)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <GaugeCard
          title="Lifestyle & Preventive"
          value={healthData.lifestyleScore.toFixed(1)}
          maxValue={20}
          color={getScoreColor((healthData.lifestyleScore / 20) * 100)}
        />
      </Grid>

      {/* Additional Metrics */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <MainCard>
          <Stack spacing={1}>
            <Typography variant="h6" color="textSecondary">
              BMI
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {healthData.bmi?.toFixed(1) || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Body Mass Index
            </Typography>
          </Stack>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <MainCard>
          <Stack spacing={1}>
            <Typography variant="h6" color="textSecondary">
              eGFR
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {healthData.egfr?.toFixed(1) || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Estimated Glomerular Filtration Rate
            </Typography>
          </Stack>
        </MainCard>
      </Grid>

      {/* Health Insights */}
      <Grid size={12}>
        <MainCard title="Health Insights">
          <Stack spacing={2}>
            <Box sx={{ p: 2, backgroundColor: '#E3F2FD', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0070C0', mb: 1 }}>
                💡 Overall Assessment
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your health score of {healthData.totalScore.toFixed(1)} indicates a {interpretation.toLowerCase()} health status.
                {healthData.totalScore >= 85 && ' Keep up the excellent work!'}
                {healthData.totalScore >= 70 && healthData.totalScore < 85 && ' You\'re doing well, but there\'s room for improvement.'}
                {healthData.totalScore >= 50 && healthData.totalScore < 70 && ' Consider focusing on improving your health metrics.'}
                {healthData.totalScore < 50 && ' We recommend consulting with a healthcare professional.'}
              </Typography>
            </Box>

            {(healthData.lifestyleScore / 20) * 100 < 70 && (
              <Box sx={{ p: 2, backgroundColor: '#FFF3E0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#FF9800', mb: 1 }}>
                  ⚠️ Lifestyle Attention Needed
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your lifestyle score is below optimal levels. Consider improving your diet, physical activity, and preventive care habits.
                </Typography>
              </Box>
            )}

            {(healthData.clinicalScore / 30) * 100 < 70 && (
              <Box sx={{ p: 2, backgroundColor: '#FFEBEE', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F44336', mb: 1 }}>
                  🏥 Clinical Monitoring Required
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your clinical vitals need attention. Please consult with your healthcare provider for a comprehensive checkup.
                </Typography>
              </Box>
            )}

            {(healthData.laboratoryScore / 50) * 100 < 70 && (
              <Box sx={{ p: 2, backgroundColor: '#E8F5E9', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#4CAF50', mb: 1 }}>
                  🔬 Laboratory Tests Review
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Some of your laboratory results are outside optimal ranges. Consider discussing these with your healthcare provider.
                </Typography>
              </Box>
            )}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
