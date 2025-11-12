import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress
} from '@mui/material';
import {
  CheckCircleOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  AppleOutlined,
  MedicineBoxOutlined,
  SmileOutlined,
  CloseOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { recommendationsService } from 'services';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed, dismissed
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationsService.getAll();
      setRecommendations(data);
      setError('');
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    try {
      setGenerating(true);
      await recommendationsService.generate();
      await fetchRecommendations();
      setError('');
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please ensure you have health data.');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      await recommendationsService.markAsCompleted(id);
      await fetchRecommendations();
    } catch (err) {
      console.error('Error marking recommendation as completed:', err);
      setError('Failed to update recommendation');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await recommendationsService.dismiss(id);
      await fetchRecommendations();
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
      setError('Failed to dismiss recommendation');
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !rec.isCompleted && !rec.isDismissed;
    if (filter === 'completed') return rec.isCompleted;
    if (filter === 'dismissed') return rec.isDismissed;
    return true;
  });

  const groupedRecommendations = filteredRecommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = [];
    }
    acc[rec.category].push(rec);
    return acc;
  }, {});

  const stats = {
    total: recommendations.length,
    active: recommendations.filter((r) => !r.isCompleted && !r.isDismissed).length,
    completed: recommendations.filter((r) => r.isCompleted).length,
    dismissed: recommendations.filter((r) => r.isDismissed).length
  };

  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'error';
    if (priority === 'medium') return 'warning';
    return 'info';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      clinical: <HeartOutlined />,
      laboratory: <MedicineBoxOutlined />,
      lifestyle: <AppleOutlined />,
      general: <SmileOutlined />
    };
    return icons[category] || <SmileOutlined />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      clinical: '#F44336',
      laboratory: '#2196F3',
      lifestyle: '#4CAF50',
      general: '#FF9800'
    };
    return colors[category] || '#9E9E9E';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
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
              Health Recommendations
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Personalized recommendations based on your health data
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} /> : <ReloadOutlined />}
            onClick={handleGenerateRecommendations}
            disabled={generating}
            sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
          >
            Generate New
          </Button>
        </Stack>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Grid>
      )}

      {/* Progress Tracker */}
      <Grid size={12}>
        <MainCard>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Progress Tracker
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {Math.round(completionPercentage)}%
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={completionPercentage} sx={{ height: 8, borderRadius: 4 }} />
            <Grid container spacing={2}>
              <Grid size={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total
                  </Typography>
                </Box>
              </Grid>
              <Grid size={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'info.main' }}>
                    {stats.active}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Active
                  </Typography>
                </Box>
              </Grid>
              <Grid size={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid size={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {stats.dismissed}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Dismissed
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </MainCard>
      </Grid>

      {/* Filter Buttons */}
      <Grid size={12}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <FilterOutlined style={{ fontSize: '1.2rem' }} />
          <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange} size="small">
            <ToggleButton value="all">All ({stats.total})</ToggleButton>
            <ToggleButton value="active">Active ({stats.active})</ToggleButton>
            <ToggleButton value="completed">Completed ({stats.completed})</ToggleButton>
            <ToggleButton value="dismissed">Dismissed ({stats.dismissed})</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Grid>

      {/* Recommendations by Category */}
      {filteredRecommendations.length === 0 ? (
        <Grid size={12}>
          <MainCard>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SmileOutlined style={{ fontSize: '3rem', color: '#9E9E9E' }} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                No Recommendations Found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {filter === 'all'
                  ? 'Click "Generate New" to create personalized recommendations based on your health data.'
                  : `No ${filter} recommendations at the moment.`}
              </Typography>
              {filter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<ReloadOutlined />}
                  onClick={handleGenerateRecommendations}
                  disabled={generating}
                  sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
                >
                  Generate Recommendations
                </Button>
              )}
            </Box>
          </MainCard>
        </Grid>
      ) : (
        Object.entries(groupedRecommendations).map(([category, recs]) => (
          <Grid size={12} key={category}>
            <MainCard
              title={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ fontSize: '1.5rem', color: getCategoryColor(category) }}>{getCategoryIcon(category)}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {category} Recommendations
                  </Typography>
                </Stack>
              }
            >
              <Stack spacing={2}>
                {recs.map((rec) => (
                  <Card
                    key={rec.id}
                    sx={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      opacity: rec.isCompleted || rec.isDismissed ? 0.6 : 1,
                      transition: 'all 0.3s'
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {rec.title}
                              </Typography>
                              <Chip label={rec.priority} color={getPriorityColor(rec.priority)} size="small" />
                              {rec.isCompleted && <Chip label="Completed" color="success" size="small" />}
                              {rec.isDismissed && <Chip label="Dismissed" color="default" size="small" />}
                            </Stack>
                            <Typography variant="body2" color="textSecondary">
                              {rec.description}
                            </Typography>
                            {rec.relatedMetric && rec.currentValue && (
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                                Current {rec.relatedMetric}: {rec.currentValue}
                              </Typography>
                            )}
                          </Box>
                          {!rec.isCompleted && !rec.isDismissed && (
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleOutlined />}
                                onClick={() => handleMarkAsCompleted(rec.id)}
                              >
                                Done
                              </Button>
                              <IconButton size="small" onClick={() => handleDismiss(rec.id)}>
                                <CloseOutlined />
                              </IconButton>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </MainCard>
          </Grid>
        ))
      )}
    </Grid>
  );
}

