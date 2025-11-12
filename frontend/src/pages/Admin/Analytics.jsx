import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { BarChartOutlined, ReloadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { adminService } from 'services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#9c27b0', '#0288d1', '#f57c00', '#c62828'];

export default function Analytics() {
  const [groupBy, setGroupBy] = useState('city');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const query = { groupBy };
      if (startDate) query.startDate = startDate;
      if (endDate) query.endDate = endDate;

      const data = await adminService.getAnalytics(query);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchAnalytics();
  };

  const handleReset = () => {
    setGroupBy('city');
    setStartDate('');
    setEndDate('');
    setTimeout(() => fetchAnalytics(), 100);
  };

  const renderChart = () => {
    if (!analyticsData || analyticsData.length === 0) {
      return (
        <MainCard>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BarChartOutlined style={{ fontSize: 64, color: '#bdbdbd', marginBottom: 16 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No data available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your filters or add more health data
            </Typography>
          </Box>
        </MainCard>
      );
    }

    // Prepare data for chart
    const chartData = analyticsData.map((item) => {
      const label = item.city || item.ageGroup || item.gender || item.riskLevel || 'Unknown';
      return {
        name: label,
        count: item.count,
        averageScore: Math.round(item.averageScore || 0)
      };
    });

    return (
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        {/* Bar Chart - 50% Width */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <BarChartOutlined style={{ fontSize: 24, color: '#1976d2' }} />
                Distribution by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
              </Typography>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#666', fontSize: 13 }}
                    axisLine={{ stroke: '#d0d0d0' }}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Count',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#666', fontSize: 12 }
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Score',
                      angle: 90,
                      position: 'insideRight',
                      style: { fill: '#666', fontSize: 12 }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      padding: '10px',
                      fontSize: '13px'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 20, fontSize: 13 }}
                    iconType="circle"
                    iconSize={10}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill="#1976d2"
                    name="User Count"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="averageScore"
                    fill="#2e7d32"
                    name="Avg Score"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Pie Chart - 50% Width */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                Distribution Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="count"
                    label={false}
                    paddingAngle={2}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      padding: '10px',
                      fontSize: '13px'
                    }}
                    formatter={(value, _name, props) => [
                      `${value} users (${((value / chartData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`,
                      props.payload.name
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={70}
                    iconType="circle"
                    iconSize={10}
                    formatter={(value, entry) => {
                      const total = chartData.reduce((sum, item) => sum + item.count, 0);
                      const percent = ((entry.payload.count / total) * 100).toFixed(1);
                      return `${value}: ${entry.payload.count} (${percent}%)`;
                    }}
                    wrapperStyle={{
                      fontSize: '13px',
                      paddingTop: '15px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };

  const renderTable = () => {
    if (!analyticsData || analyticsData.length === 0) {
      return null;
    }

    const getScoreColor = (score) => {
      if (score >= 85) return '#2e7d32';
      if (score >= 70) return '#1976d2';
      if (score >= 50) return '#ed6c02';
      return '#d32f2f';
    };

    return (
      <Card
        elevation={2}
        sx={{
          mt: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Detailed Analytics
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>
                    {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>
                    User Count
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>
                    Average Score
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>
                    Health Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.map((item, index) => {
                  const label = item.city || item.ageGroup || item.gender || item.riskLevel || 'Unknown';
                  const score = item.averageScore || 0;
                  const scoreColor = getScoreColor(score);

                  let healthStatus = 'N/A';
                  if (score >= 85) healthStatus = 'Excellent';
                  else if (score >= 70) healthStatus = 'Good';
                  else if (score >= 50) healthStatus = 'Fair';
                  else if (score > 0) healthStatus = 'Needs Attention';

                  return (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem', py: 2.5 }}>
                        {label}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 700,
                            fontSize: '1rem',
                            minWidth: 60
                          }}
                        >
                          {item.count}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${scoreColor}15`,
                            color: scoreColor,
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 700,
                            fontSize: '1rem',
                            minWidth: 70
                          }}
                        >
                          {score > 0 ? score.toFixed(1) : 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${scoreColor}15`,
                            color: scoreColor,
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            minWidth: 140
                          }}
                        >
                          {healthStatus}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Health Analytics Dashboard
      </Typography>

      {/* Filters */}
      <Card
        elevation={2}
        sx={{
          mb: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            Filter Options
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="medium">
                <InputLabel>Group By</InputLabel>
                <Select
                  value={groupBy}
                  label="Group By"
                  onChange={(e) => setGroupBy(e.target.value)}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <MenuItem value="city">📍 City</MenuItem>
                  <MenuItem value="age">👥 Age Group</MenuItem>
                  <MenuItem value="gender">⚧ Gender</MenuItem>
                  <MenuItem value="risk">⚠️ Risk Level</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: 'background.paper' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: 'background.paper' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<BarChartOutlined />}
                  onClick={handleApplyFilters}
                  disabled={loading}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4
                    }
                  }}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ReloadOutlined />}
                  onClick={handleReset}
                  disabled={loading}
                  size="large"
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    minWidth: 100
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Charts */}
      {!loading && !error && renderChart()}

      {/* Table */}
      {!loading && !error && renderTable()}
    </Box>
  );
}

