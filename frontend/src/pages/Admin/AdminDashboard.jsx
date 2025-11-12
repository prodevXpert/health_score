import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material';
import {
  TeamOutlined,
  FileTextOutlined,
  TrophyOutlined,
  UserAddOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { adminService } from 'services';

// Stat Card Component
function StatCard({ title, value, icon, color, trend }) {
  const Icon = icon;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
              width: 56,
              height: 56
            }}
          >
            <Icon style={{ fontSize: '24px' }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div">
              {value}
            </Typography>
            {trend && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                {trend > 0 ? (
                  <RiseOutlined style={{ color: 'green', fontSize: '16px' }} />
                ) : (
                  <FallOutlined style={{ color: 'red', fontSize: '16px' }} />
                )}
                <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                  {Math.abs(trend)}% from last month
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Risk Distribution Chart Component
function RiskDistributionCard({ distribution }) {
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);

  const riskLevels = [
    { key: 'excellent', label: 'Excellent', color: 'success' },
    { key: 'good', label: 'Good', color: 'info' },
    { key: 'fair', label: 'Fair', color: 'warning' },
    { key: 'needsAttention', label: 'Needs Attention', color: 'error' }
  ];

  return (
    <MainCard title="Health Score Distribution">
      <Stack spacing={2}>
        {riskLevels.map((level) => {
          const count = distribution[level.key] || 0;
          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

          return (
            <Box key={level.key}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2">{level.label}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {count} ({percentage}%)
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: '100%',
                    bgcolor: `${level.color}.main`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Stack>
    </MainCard>
  );
}

// Recent Activity Component
function RecentActivityCard({ activities }) {
  return (
    <MainCard title="Recent Activity">
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Test Date</TableCell>
              <TableCell align="right">Added</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <TableRow key={activity.id} hover>
                  <TableCell>{activity.userName}</TableCell>
                  <TableCell>
                    {new Date(activity.testDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" color="textSecondary">
                      {new Date(activity.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No recent activity
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={TeamOutlined}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Health Records"
            value={stats?.totalHealthRecords || 0}
            icon={FileTextOutlined}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={stats?.averageHealthScore || 0}
            icon={TrophyOutlined}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users (30d)"
            value={stats?.activeUsers || 0}
            icon={UserAddOutlined}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Risk Distribution and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RiskDistributionCard distribution={stats?.riskDistribution || {}} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivityCard activities={stats?.recentActivity || []} />
        </Grid>
      </Grid>
    </Box>
  );
}

