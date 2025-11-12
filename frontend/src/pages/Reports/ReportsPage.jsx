import FileOutlined from '@ant-design/icons/FileOutlined';
import FilePdfOutlined from '@ant-design/icons/FilePdfOutlined';
import PrinterOutlined from '@ant-design/icons/PrinterOutlined';
import { Box, Button, Card, CardContent, Grid, Stack, Typography, LinearProgress, Alert, CircularProgress, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { healthDataService } from 'services';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { generateHealthScorePDF } from 'utils/pdfExport';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await healthDataService.getLatestHealthData();
        setHealthData(data);

        // Fetch detailed score breakdown
        const breakdown = await healthDataService.getScoreBreakdown(data.id);
        setScoreBreakdown(breakdown);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 404) {
          setHealthData(null);
        } else {
          setError('Failed to load report data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportPDF = () => {
    if (healthData && scoreBreakdown) {
      generateHealthScorePDF(healthData, scoreBreakdown, user);
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return '#2196F3';
    if (percentage >= 70) return '#4CAF50';
    if (percentage >= 50) return '#FF9800';
    return '#F44336';
  };

  const ScoreBar = ({ label, score, maxScore, description }) => (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: getScoreColor(score, maxScore) }}>
          {score.toFixed(1)}/{maxScore}
        </Typography>
      </Stack>
      {description && (
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
          {description}
        </Typography>
      )}
      <LinearProgress
        variant="determinate"
        value={(score / maxScore) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getScoreColor(score, maxScore),
            borderRadius: 4
          }
        }}
      />
    </Box>
  );

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
          Reports
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          No health data found. Add health data to generate comprehensive reports.
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

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Health Score Report
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Detailed breakdown of your health assessment
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<FilePdfOutlined />}
              onClick={handleExportPDF}
              sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
            >
              Export as PDF
            </Button>
            <Button variant="outlined" startIcon={<PrinterOutlined />} onClick={() => window.print()}>
              Print Report
            </Button>
          </Stack>
        </Stack>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {/* Summary Card */}
      <Grid size={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)', color: 'white' }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Patient Name
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user?.fullName || 'User'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Age / Gender
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user?.age} / {user?.gender}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Report Date
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {new Date(healthData.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Total Health Score
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {healthData.totalScore.toFixed(1)}/100
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Clinical & Vitals Breakdown */}
      <Grid size={12}>
        <MainCard title="Clinical & Vitals (30 points)">
          <ScoreBar
            label="Anthropometry"
            score={scoreBreakdown?.subcategories?.anthropometry || 0}
            maxScore={10}
            description="Height, Weight, Waist Circumference, BMI"
          />
          <ScoreBar
            label="Blood Pressure"
            score={scoreBreakdown?.subcategories?.bloodPressure || 0}
            maxScore={10}
            description="Systolic and Diastolic Blood Pressure"
          />
          <ScoreBar
            label="Heart & Cardio"
            score={scoreBreakdown?.subcategories?.heartCardio || 0}
            maxScore={10}
            description="Resting Heart Rate, ECG Result"
          />
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Category Total: {healthData.clinicalScore.toFixed(1)}/30
            </Typography>
            <Typography variant="body2" color="textSecondary">
              BMI: {healthData.bmi?.toFixed(1) || 'N/A'} kg/m²
            </Typography>
          </Box>
        </MainCard>
      </Grid>

      {/* Laboratory Tests Breakdown */}
      <Grid size={12}>
        <MainCard title="Laboratory & Biomarkers (50 points)">
          <ScoreBar
            label="Glycemic Control"
            score={scoreBreakdown?.subcategories?.glycemic || 0}
            maxScore={8}
            description="Fasting Plasma Glucose, HbA1c"
          />
          <ScoreBar
            label="Lipid Profile"
            score={scoreBreakdown?.subcategories?.lipid || 0}
            maxScore={8}
            description="Total Cholesterol, LDL, HDL, Triglycerides"
          />
          <ScoreBar
            label="Renal Function"
            score={scoreBreakdown?.subcategories?.renal || 0}
            maxScore={6}
            description="Serum Creatinine, BUN, eGFR"
          />
          <ScoreBar
            label="Liver Function"
            score={scoreBreakdown?.subcategories?.liver || 0}
            maxScore={6}
            description="ALT, AST, Total Bilirubin"
          />
          <ScoreBar
            label="Hematology"
            score={scoreBreakdown?.subcategories?.hematology || 0}
            maxScore={6}
            description="Hemoglobin, WBC Count, Platelet Count"
          />
          <ScoreBar
            label="Thyroid Function"
            score={scoreBreakdown?.subcategories?.thyroid || 0}
            maxScore={6}
            description="TSH"
          />
          <ScoreBar
            label="Inflammation"
            score={scoreBreakdown?.subcategories?.inflammation || 0}
            maxScore={5}
            description="C-Reactive Protein (CRP)"
          />
          <ScoreBar
            label="Vitamins"
            score={scoreBreakdown?.subcategories?.vitamins || 0}
            maxScore={5}
            description="Vitamin D, Vitamin B12"
          />
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Category Total: {healthData.laboratoryScore.toFixed(1)}/50
            </Typography>
            <Typography variant="body2" color="textSecondary">
              eGFR: {healthData.egfr?.toFixed(1) || 'N/A'} mL/min/1.73m²
            </Typography>
          </Box>
        </MainCard>
      </Grid>

      {/* Lifestyle & Preventive Breakdown */}
      <Grid size={12}>
        <MainCard title="Lifestyle & Preventive Care (20 points)">
          <ScoreBar
            label="Smoking Status"
            score={scoreBreakdown?.subcategories?.smoking || 0}
            maxScore={5}
            description="Current smoking habits"
          />
          <ScoreBar
            label="Alcohol Consumption"
            score={scoreBreakdown?.subcategories?.alcohol || 0}
            maxScore={3}
            description="Alcohol intake frequency"
          />
          <ScoreBar
            label="Physical Activity"
            score={scoreBreakdown?.subcategories?.physicalActivity || 0}
            maxScore={5}
            description="Exercise and activity levels"
          />
          <ScoreBar
            label="Diet Quality"
            score={scoreBreakdown?.subcategories?.diet || 0}
            maxScore={4}
            description="Nutritional habits"
          />
          <ScoreBar
            label="Preventive Care"
            score={scoreBreakdown?.subcategories?.preventiveCare || 0}
            maxScore={3}
            description="Regular health checkups and screenings"
          />
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Category Total: {healthData.lifestyleScore.toFixed(1)}/20
            </Typography>
          </Box>
        </MainCard>
      </Grid>

      {/* Recommendations */}
      <Grid size={12}>
        <MainCard title="Health Recommendations">
          <Stack spacing={2}>
            {healthData.totalScore >= 85 && (
              <Alert severity="success">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Excellent Health Status
                </Typography>
                <Typography variant="body2">
                  Your health metrics are in excellent range. Continue maintaining your healthy lifestyle habits.
                </Typography>
              </Alert>
            )}

            {healthData.totalScore >= 70 && healthData.totalScore < 85 && (
              <Alert severity="info">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Good Health Status
                </Typography>
                <Typography variant="body2">
                  Your health is generally good. Focus on areas with lower scores to achieve excellent health.
                </Typography>
              </Alert>
            )}

            {healthData.totalScore >= 50 && healthData.totalScore < 70 && (
              <Alert severity="warning">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Fair Health Status
                </Typography>
                <Typography variant="body2">
                  Some health metrics need attention. Consider consulting with healthcare professionals for improvement strategies.
                </Typography>
              </Alert>
            )}

            {healthData.totalScore < 50 && (
              <Alert severity="error">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Needs Attention
                </Typography>
                <Typography variant="body2">
                  Multiple health metrics require immediate attention. Please consult with your healthcare provider for a comprehensive evaluation.
                </Typography>
              </Alert>
            )}

            {(healthData.clinicalScore / 30) * 100 < 70 && (
              <Box sx={{ p: 2, backgroundColor: '#FFEBEE', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F44336', mb: 1 }}>
                  ⚠️ Clinical Vitals Need Attention
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Consider monitoring your blood pressure, heart rate, and body composition more closely.
                </Typography>
              </Box>
            )}

            {(healthData.laboratoryScore / 50) * 100 < 70 && (
              <Box sx={{ p: 2, backgroundColor: '#FFF3E0', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FF9800', mb: 1 }}>
                  🔬 Laboratory Results Review Recommended
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Some biomarkers are outside optimal ranges. Discuss these results with your healthcare provider.
                </Typography>
              </Box>
            )}

            {(healthData.lifestyleScore / 20) * 100 < 70 && (
              <Box sx={{ p: 2, backgroundColor: '#E8F5E9', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50', mb: 1 }}>
                  🏃 Lifestyle Improvements Suggested
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Focus on improving diet quality, increasing physical activity, and maintaining preventive care schedules.
                </Typography>
              </Box>
            )}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
