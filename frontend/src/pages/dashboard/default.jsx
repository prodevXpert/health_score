import { Grid, Typography, Alert, CircularProgress, Box, Button, Card, CardContent, Stack, Chip } from '@mui/material';
import GaugeCard from 'components/GaugeCard';
import SummaryCard from 'components/SummaryCard';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { healthDataService, notificationsService } from 'services';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined';
import ArrowDownOutlined from '@ant-design/icons/ArrowDownOutlined';
import MinusOutlined from '@ant-design/icons/MinusOutlined';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch latest health data and historical data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await healthDataService.getLatestHealthData();
        setHealthData(data);

        // Fetch historical data for trends
        const allData = await healthDataService.getAllHealthData();
        setHistoricalData(allData.slice(0, 6).reverse()); // Last 6 entries

        // Fetch recent notifications
        const notifications = await notificationsService.getAll();
        setRecentNotifications(notifications.slice(0, 5));

        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 404) {
          setHealthData(null);
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 85) return '#2196F3'; // Blue - Excellent
    if (score >= 70) return '#4CAF50'; // Green - Good
    if (score >= 50) return '#FF9800'; // Orange - Fair
    return '#F44336'; // Red - Needs Attention
  };

  // Get interpretation based on score
  const getInterpretation = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  };

  // Calculate score change
  const getScoreChange = () => {
    if (historicalData.length < 2) return { change: 0, percentage: 0 };
    const current = parseFloat(historicalData[historicalData.length - 1]?.overallScore || 0);
    const previous = parseFloat(historicalData[historicalData.length - 2]?.overallScore || 0);
    const change = current - previous;
    const percentage = previous !== 0 ? ((change / previous) * 100).toFixed(1) : 0;
    return { change: change.toFixed(1), percentage };
  };

  // Calculate average score
  const getAverageScore = () => {
    if (historicalData.length === 0) return 0;
    const sum = historicalData.reduce((acc, data) => acc + parseFloat(data.overallScore || 0), 0);
    return (sum / historicalData.length).toFixed(1);
  };

  // Calculate days since last update
  const getDaysSinceLastUpdate = () => {
    if (!healthData) return 0;
    const lastUpdate = new Date(healthData.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - lastUpdate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Prepare sparkline data
  const sparklineData = historicalData.map((data) => ({
    score: parseFloat(data.overallScore || 0)
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      {/* Header */}
      <Grid size={12} sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Welcome back, {user?.fullName || 'User'}!
            </Typography>
          </Box>
          {!healthData && !loading && (
            <Button
              variant="contained"
              onClick={() => navigate('/health-data')}
              sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
            >
              Add Health Data
            </Button>
          )}
        </Box>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {!healthData && !loading && (
        <Grid size={12}>
          <Alert severity="info">
            No health data found. Click "Add Health Data" to get started and receive your comprehensive health score!
          </Alert>
        </Grid>
      )}

      {healthData && (
        <>
          {/* Total Health Score with Trend */}
          <Grid size={12}>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${getScoreColor(parseFloat(healthData.overallScore))} 0%, ${getScoreColor(parseFloat(healthData.overallScore))}CC 100%)`,
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  {parseFloat(healthData.overallScore).toFixed(1)}
                </Typography>
                {historicalData.length >= 2 && (
                  <Chip
                    icon={
                      getScoreChange().change > 0 ? (
                        <ArrowUpOutlined />
                      ) : getScoreChange().change < 0 ? (
                        <ArrowDownOutlined />
                      ) : (
                        <MinusOutlined />
                      )
                    }
                    label={`${getScoreChange().change > 0 ? '+' : ''}${getScoreChange().change} (${getScoreChange().percentage}%)`}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                )}
              </Stack>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {getInterpretation(parseFloat(healthData.overallScore))}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Your Overall Health Score (out of 100)
              </Typography>
            </Box>
          </Grid>

          {/* Quick Stats Cards */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MainCard>
              <Stack spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  Total Entries
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {historicalData.length}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MainCard>
              <Stack spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  Days Since Update
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {getDaysSinceLastUpdate()}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MainCard>
              <Stack spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  Average Score
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {getAverageScore()}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MainCard>
              <Stack spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  Trend
                </Typography>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color:
                        getScoreChange().change > 0
                          ? 'success.main'
                          : getScoreChange().change < 0
                            ? 'error.main'
                            : 'text.primary'
                    }}
                  >
                    {getScoreChange().change > 0 ? '+' : ''}
                    {getScoreChange().change}
                  </Typography>
                  {getScoreChange().change > 0 ? (
                    <ArrowUpOutlined style={{ color: '#4CAF50', fontSize: '1.5rem' }} />
                  ) : getScoreChange().change < 0 ? (
                    <ArrowDownOutlined style={{ color: '#F44336', fontSize: '1.5rem' }} />
                  ) : (
                    <MinusOutlined style={{ color: '#9E9E9E', fontSize: '1.5rem' }} />
                  )}
                </Stack>
              </Stack>
            </MainCard>
          </Grid>

          {/* Sparkline Trend */}
          {sparklineData.length > 1 && (
            <Grid size={12}>
              <MainCard title="Score Trend (Last 6 Entries)">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={sparklineData}>
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={getScoreColor(parseFloat(healthData.overallScore))}
                      strokeWidth={3}
                      dot={{ fill: getScoreColor(parseFloat(healthData.overallScore)), r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </MainCard>
            </Grid>
          )}

          {/* Category Scores */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <GaugeCard
              title="Clinical & Vitals"
              value={parseFloat(healthData.clinicalScore).toFixed(1)}
              maxValue={30}
              color={getScoreColor((parseFloat(healthData.clinicalScore) / 30) * 100)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <GaugeCard
              title="Laboratory Tests"
              value={parseFloat(healthData.labScore).toFixed(1)}
              maxValue={50}
              color={getScoreColor((parseFloat(healthData.labScore) / 50) * 100)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <GaugeCard
              title="Lifestyle & Preventive"
              value={parseFloat(healthData.lifestyleScore).toFixed(1)}
              maxValue={20}
              color={getScoreColor((parseFloat(healthData.lifestyleScore) / 20) * 100)}
            />
          </Grid>

          {/* Recent Activity */}
          {historicalData.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <MainCard title="Recent Activity">
                <Stack spacing={2}>
                  {historicalData.slice(0, 5).reverse().map((data, index) => (
                    <Box
                      key={data.id}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: index === 0 ? 'primary.lighter' : 'grey.50',
                        border: index === 0 ? '1px solid' : 'none',
                        borderColor: 'primary.main'
                      }}
                    >
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Health Assessment
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(data.testDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${parseFloat(data.overallScore).toFixed(1)}`}
                          sx={{
                            bgcolor: getScoreColor(parseFloat(data.overallScore)),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </MainCard>
            </Grid>
          )}

          {/* Recent Notifications */}
          {recentNotifications.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <MainCard title="Recent Notifications">
                <Stack spacing={2}>
                  {recentNotifications.map((notification) => (
                    <Box
                      key={notification.id}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: notification.isRead ? 'grey.50' : 'info.lighter',
                        border: !notification.isRead ? '1px solid' : 'none',
                        borderColor: 'info.main'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </MainCard>
            </Grid>
          )}

          {/* Summary Cards */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <SummaryCard title="BMI" value={healthData.bmi?.toFixed(1) || 'N/A'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <SummaryCard title="eGFR" value={healthData.egfr?.toFixed(1) || 'N/A'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <SummaryCard
              title="Last Updated"
              value={new Date(healthData.createdAt).toLocaleDateString()}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/health-data')}
              sx={{ height: '100%', minHeight: 80 }}
            >
              Update Health Data
            </Button>
          </Grid>

          {/* Quick Actions */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={() => navigate('/my-health-score')}>
                View Detailed Score
              </Button>
              <Button variant="contained" onClick={() => navigate('/trends')}>
                View Trends
              </Button>
              <Button variant="contained" onClick={() => navigate('/reports')}>
                View Reports
              </Button>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
}
