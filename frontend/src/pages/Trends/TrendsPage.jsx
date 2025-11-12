import { Box, Card, CardContent, Grid, Stack, Typography, ToggleButton, ToggleButtonGroup, Alert, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TablePagination, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { EditOutlined, DeleteOutlined, DownloadOutlined, LineChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { healthDataService } from 'services';
import { useNavigate } from 'react-router-dom';

export default function TrendsPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('all');
  const [healthDataList, setHealthDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMetrics, setSelectedMetrics] = useState(['totalScore', 'clinicalScore', 'laboratoryScore', 'lifestyleScore']);
  const [showAverage, setShowAverage] = useState(false);

  const metricOptions = [
    { value: 'totalScore', label: 'Overall Score', color: '#0070C0' },
    { value: 'clinicalScore', label: 'Clinical', color: '#4CAF50' },
    { value: 'laboratoryScore', label: 'Laboratory', color: '#2196F3' },
    { value: 'lifestyleScore', label: 'Lifestyle', color: '#FF9800' },
    { value: 'bmi', label: 'BMI', color: '#9C27B0' }
  ];

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const data = await healthDataService.getAllHealthData();
        setHealthDataList(data);
        setError('');
      } catch (err) {
        console.error('Error fetching health data:', err);
        if (err.response?.status === 404) {
          setHealthDataList([]);
        } else {
          setError('Failed to load health data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  // Transform API data to chart format
  const historicalData = useMemo(() => {
    if (!healthDataList || healthDataList.length === 0) return [];

    return healthDataList
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(item => ({
        date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: new Date(item.createdAt),
        totalScore: item.totalScore,
        clinicalScore: (item.clinicalScore / 30) * 100, // Normalize to 100
        laboratoryScore: (item.laboratoryScore / 50) * 100, // Normalize to 100
        lifestyleScore: (item.lifestyleScore / 20) * 100, // Normalize to 100
        bmi: item.bmi,
        egfr: item.egfr
      }));
  }, [healthDataList]);

  const filteredData = useMemo(() => {
    const now = new Date();
    switch (timeRange) {
      case '1month':
        return historicalData.filter(item => {
          const diff = now - item.fullDate;
          return diff <= 30 * 24 * 60 * 60 * 1000; // 30 days
        });
      case '3months':
        return historicalData.filter(item => {
          const diff = now - item.fullDate;
          return diff <= 90 * 24 * 60 * 60 * 1000; // 90 days
        });
      case '6months':
        return historicalData.filter(item => {
          const diff = now - item.fullDate;
          return diff <= 180 * 24 * 60 * 60 * 1000; // 180 days
        });
      case 'all':
      default:
        return historicalData;
    }
  }, [timeRange, historicalData]);

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const handleMetricChange = (event) => {
    const value = event.target.value;
    setSelectedMetrics(typeof value === 'string' ? value.split(',') : value);
  };

  const handleToggleAverage = () => {
    setShowAverage(!showAverage);
  };

  const handleEdit = (entry) => {
    navigate('/health-data', { state: { editData: entry } });
  };

  const handleDeleteClick = (entry) => {
    setSelectedEntry(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await healthDataService.deleteHealthData(selectedEntry.id);
      setHealthDataList(healthDataList.filter(item => item.id !== selectedEntry.id));
      setDeleteDialogOpen(false);
      setSelectedEntry(null);
    } catch (err) {
      console.error('Error deleting health data:', err);
      setError('Failed to delete health data');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Overall Score', 'Clinical', 'Laboratory', 'Lifestyle', 'BMI', 'eGFR', 'Interpretation'];
    const rows = healthDataList.map(item => [
      new Date(item.createdAt).toLocaleDateString(),
      item.overallScore || item.totalScore,
      item.clinicalScore,
      item.labScore || item.laboratoryScore,
      item.lifestyleScore,
      item.bmi || 'N/A',
      item.egfr || 'N/A',
      item.scoreInterpretation
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `health-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInterpretationColor = (interpretation) => {
    switch (interpretation) {
      case 'Excellent': return 'primary';
      case 'Good': return 'success';
      case 'Fair': return 'warning';
      case 'Needs Attention': return 'error';
      default: return 'default';
    }
  };

  // Calculate trends
  const calculateTrend = (data, key) => {
    if (data.length < 2) return 0;
    const first = data[0][key];
    const last = data[data.length - 1][key];
    return ((last - first) / first * 100).toFixed(1);
  };

  const trends = useMemo(() => ({
    total: calculateTrend(filteredData, 'totalScore'),
    clinical: calculateTrend(filteredData, 'clinicalScore'),
    laboratory: calculateTrend(filteredData, 'laboratoryScore'),
    lifestyle: calculateTrend(filteredData, 'lifestyleScore')
  }), [filteredData]);

  // Calculate average values for comparison
  const averageValues = useMemo(() => {
    if (filteredData.length === 0) return {};
    const sum = filteredData.reduce(
      (acc, item) => ({
        totalScore: acc.totalScore + item.totalScore,
        clinicalScore: acc.clinicalScore + item.clinicalScore,
        laboratoryScore: acc.laboratoryScore + item.laboratoryScore,
        lifestyleScore: acc.lifestyleScore + item.lifestyleScore,
        bmi: acc.bmi + (item.bmi || 0)
      }),
      { totalScore: 0, clinicalScore: 0, laboratoryScore: 0, lifestyleScore: 0, bmi: 0 }
    );
    return {
      totalScore: sum.totalScore / filteredData.length,
      clinicalScore: sum.clinicalScore / filteredData.length,
      laboratoryScore: sum.laboratoryScore / filteredData.length,
      lifestyleScore: sum.lifestyleScore / filteredData.length,
      bmi: sum.bmi / filteredData.length
    };
  }, [filteredData]);

  // Generate trend insights
  const trendInsights = useMemo(() => {
    const insights = [];
    const totalTrend = parseFloat(trends.total);
    const clinicalTrend = parseFloat(trends.clinical);
    const laboratoryTrend = parseFloat(trends.laboratory);
    const lifestyleTrend = parseFloat(trends.lifestyle);

    if (totalTrend > 5) {
      insights.push({
        type: 'success',
        message: `Your overall score improved by ${totalTrend}% in the selected period. Great progress!`
      });
    } else if (totalTrend < -5) {
      insights.push({
        type: 'warning',
        message: `Your overall score decreased by ${Math.abs(totalTrend)}% in the selected period. Consider reviewing your health habits.`
      });
    } else {
      insights.push({
        type: 'info',
        message: `Your overall score has been stable with a ${totalTrend}% change.`
      });
    }

    if (laboratoryTrend > 5) {
      insights.push({
        type: 'success',
        message: `Laboratory scores show significant improvement (${laboratoryTrend}%).`
      });
    }

    if (lifestyleTrend > 5) {
      insights.push({
        type: 'success',
        message: `Lifestyle scores improved by ${lifestyleTrend}%. Keep up the healthy habits!`
      });
    }

    if (filteredData.length > 1) {
      const bmiValues = filteredData.map((d) => d.bmi).filter((b) => b);
      if (bmiValues.length > 1) {
        const bmiChange = Math.abs(bmiValues[bmiValues.length - 1] - bmiValues[0]);
        if (bmiChange < 0.5) {
          insights.push({
            type: 'info',
            message: 'Your BMI has been stable.'
          });
        }
      }
    }

    return insights;
  }, [trends, filteredData]);

  const TrendIndicator = ({ value, label }) => {
    const isPositive = parseFloat(value) >= 0;
    return (
      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: isPositive ? '#4CAF50' : '#F44336' }}>
          {isPositive ? '+' : ''}{value}%
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (healthDataList.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Trends
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          No health data found. Add at least one health data entry to see trends over time.
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
              Trends
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Track your health metrics over time ({healthDataList.length} {healthDataList.length === 1 ? 'entry' : 'entries'})
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
            sx={{ backgroundColor: 'white' }}
          >
            <ToggleButton value="1month">1 Month</ToggleButton>
            <ToggleButton value="3months">3 Months</ToggleButton>
            <ToggleButton value="6months">6 Months</ToggleButton>
            <ToggleButton value="all">All Time</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {/* Metric Selector and Controls */}
      <Grid size={12}>
        <MainCard>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Select Metrics</InputLabel>
              <Select
                multiple
                value={selectedMetrics}
                onChange={handleMetricChange}
                input={<OutlinedInput label="Select Metrics" />}
                renderValue={(selected) =>
                  selected
                    .map((val) => metricOptions.find((opt) => opt.value === val)?.label)
                    .join(', ')
                }
              >
                {metricOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={selectedMetrics.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant={showAverage ? 'contained' : 'outlined'}
              onClick={handleToggleAverage}
              startIcon={<LineChartOutlined />}
            >
              {showAverage ? 'Hide' : 'Show'} Average
            </Button>
          </Stack>
        </MainCard>
      </Grid>

      {/* Trend Insights */}
      <Grid size={12}>
        <MainCard title="Trend Insights">
          <Stack spacing={2}>
            {trendInsights.map((insight, index) => (
              <Alert key={index} severity={insight.type} icon={insight.type === 'success' ? <ArrowUpOutlined /> : insight.type === 'warning' ? <ArrowDownOutlined /> : undefined}>
                {insight.message}
              </Alert>
            ))}
          </Stack>
        </MainCard>
      </Grid>

      {/* Trend Indicators */}
      <Grid size={{ xs: 6, sm: 3 }}>
        <TrendIndicator value={trends.total} label="Total Score" />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TrendIndicator value={trends.clinical} label="Clinical" />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TrendIndicator value={trends.laboratory} label="Laboratory" />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TrendIndicator value={trends.lifestyle} label="Lifestyle" />
      </Grid>

      {/* Multi-Metric Trend Chart */}
      <Grid size={12}>
        <MainCard title="Health Metrics Trend">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {selectedMetrics.map((metric) => {
                const option = metricOptions.find((opt) => opt.value === metric);
                return (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={option?.color}
                    strokeWidth={2}
                    name={option?.label}
                    dot={{ r: 4 }}
                  />
                );
              })}
              {showAverage &&
                selectedMetrics.map((metric) => {
                  const option = metricOptions.find((opt) => opt.value === metric);
                  return (
                    <ReferenceLine
                      key={`avg-${metric}`}
                      y={averageValues[metric]}
                      stroke={option?.color}
                      strokeDasharray="5 5"
                      label={`Avg ${option?.label}`}
                    />
                  );
                })}
            </LineChart>
          </ResponsiveContainer>
        </MainCard>
      </Grid>

      {/* Category Scores Comparison */}
      <Grid size={12}>
        <MainCard title="Category Scores Comparison (Normalized to 100)">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clinicalScore" stroke="#2196F3" strokeWidth={2} name="Clinical & Vitals (%)" />
              <Line type="monotone" dataKey="laboratoryScore" stroke="#4CAF50" strokeWidth={2} name="Laboratory Tests (%)" />
              <Line type="monotone" dataKey="lifestyleScore" stroke="#FF9800" strokeWidth={2} name="Lifestyle & Preventive (%)" />
            </LineChart>
          </ResponsiveContainer>
        </MainCard>
      </Grid>

      {/* BMI and eGFR Trends */}
      {filteredData.some(d => d.bmi || d.egfr) && (
        <Grid size={12}>
          <MainCard title="BMI & eGFR Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                {filteredData.some(d => d.bmi) && (
                  <Line yAxisId="left" type="monotone" dataKey="bmi" stroke="#9C27B0" strokeWidth={2} name="BMI" />
                )}
                {filteredData.some(d => d.egfr) && (
                  <Line yAxisId="right" type="monotone" dataKey="egfr" stroke="#00BCD4" strokeWidth={2} name="eGFR" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </MainCard>
        </Grid>
      )}

      {/* Historical Data Table */}
      <Grid size={12}>
        <MainCard
          title="Historical Data"
          secondary={
            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={exportToCSV}
              size="small"
            >
              Export to CSV
            </Button>
          }
        >
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Test Date</strong></TableCell>
                  <TableCell align="center"><strong>Overall Score</strong></TableCell>
                  <TableCell align="center"><strong>Clinical</strong></TableCell>
                  <TableCell align="center"><strong>Laboratory</strong></TableCell>
                  <TableCell align="center"><strong>Lifestyle</strong></TableCell>
                  <TableCell align="center"><strong>BMI</strong></TableCell>
                  <TableCell align="center"><strong>Interpretation</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {healthDataList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>{new Date(entry.testDate || entry.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {parseFloat(entry.overallScore || entry.totalScore).toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{parseFloat(entry.clinicalScore).toFixed(1)}/30</TableCell>
                      <TableCell align="center">{parseFloat(entry.labScore || entry.laboratoryScore).toFixed(1)}/50</TableCell>
                      <TableCell align="center">{parseFloat(entry.lifestyleScore).toFixed(1)}/20</TableCell>
                      <TableCell align="center">{entry.bmi ? parseFloat(entry.bmi).toFixed(1) : 'N/A'}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={entry.scoreInterpretation}
                          color={getInterpretationColor(entry.scoreInterpretation)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(entry)}
                          title="Edit"
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(entry)}
                          title="Delete"
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={healthDataList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </MainCard>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this health data entry from {selectedEntry && new Date(selectedEntry.testDate || selectedEntry.createdAt).toLocaleDateString()}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

