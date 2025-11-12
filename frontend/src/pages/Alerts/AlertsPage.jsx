import { WarningOutlined } from '@ant-design/icons';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useUsers } from 'hooks/useUsers';
import { useMemo } from 'react';

export default function AlertsPage() {
  const { users } = useUsers();

  // Filter only Fair and Poor risk users
  const alertUsers = useMemo(() => {
    return users
      .filter((u) => ['Fair', 'Poor'].includes(u.risk_label))
      .sort((a, b) => {
        // Sort by risk level (Poor first, then Fair)
        const riskOrder = { Poor: 0, Fair: 1 };
        return riskOrder[a.risk_label] - riskOrder[b.risk_label];
      });
  }, [users]);

  const getRiskColor = (riskLabel) => {
    switch (riskLabel) {
      case 'Fair':
        return 'warning';
      case 'Poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRiskSeverity = (riskLabel) => {
    switch (riskLabel) {
      case 'Poor':
        return 'error';
      case 'Fair':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={12}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Alerts
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Users with Fair or Poor health risk levels
        </Typography>
      </Grid>

      {/* Alert Summary */}
      <Grid size={12}>
        <Alert severity="warning" icon={<WarningOutlined />} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>{alertUsers.length} users</strong> require attention. {alertUsers.filter((u) => u.risk_label === 'Poor').length} are in{' '}
            <strong>Poor</strong> condition and {alertUsers.filter((u) => u.risk_label === 'Fair').length} are in <strong>Fair</strong>{' '}
            condition.
          </Typography>
        </Alert>
      </Grid>

      {/* Alerts Table */}
      <Grid size={12}>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              At-Risk Users ({alertUsers.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Health Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lifestyle Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Vitals Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Activity Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Risk Level</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alertUsers.length > 0 ? (
                    alertUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          '&:hover': { backgroundColor: '#fafafa' },
                          backgroundColor: user.risk_label === 'Poor' ? 'rgba(244, 67, 54, 0.05)' : 'rgba(255, 152, 0, 0.05)'
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{user.full_name}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>{user.city}</TableCell>
                        <TableCell>
                          <Box sx={{ fontWeight: 600, color: '#0070C0' }}>{user.health_score}</Box>
                        </TableCell>
                        <TableCell>{user.lifestyle_score}</TableCell>
                        <TableCell>{user.vitals_score}</TableCell>
                        <TableCell>{user.activity_score}</TableCell>
                        <TableCell>
                          <Chip label={user.risk_label} color={getRiskColor(user.risk_label)} size="small" variant="filled" />
                        </TableCell>
                        <TableCell>{user.last_updated}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3 }}>
                        <Typography color="textSecondary">No alerts at this time. All users are in good health!</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
