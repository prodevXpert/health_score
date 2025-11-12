import { CloudUploadOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import AddUserModal from 'components/AddUserModal';
import UploadUsersModal from 'components/UploadUsersModal';
import { useUsers } from 'hooks/useUsers';
import { useMemo, useState } from 'react';

export default function UsersPage() {
  const { users, addUser, addUsers } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // Get unique risk labels
  const riskLabels = useMemo(() => {
    return [...new Set(users.map((u) => u.risk_label))].sort();
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || user.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = !riskFilter || user.risk_label === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter, users]);

  const getRiskColor = (riskLabel) => {
    switch (riskLabel) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'info';
      case 'Fair':
        return 'warning';
      case 'Poor':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={12}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Users
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage and view all users in the system
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<UserAddOutlined />}
              onClick={() => setOpenAddModal(true)}
              sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadOutlined />}
              onClick={() => setOpenUploadModal(true)}
              sx={{ borderColor: '#0070C0', color: '#0070C0' }}
            >
              Upload
            </Button>
          </Stack>
        </Stack>
      </Grid>

      {/* Filters */}
      <Grid size={12}>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField
                fullWidth
                placeholder="Search by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  )
                }}
                variant="outlined"
                size="small"
              />
              <TextField
                select
                label="Filter by Risk"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Risk Levels</MenuItem>
                {riskLabels.map((label) => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Users Table */}
      <Grid size={12}>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              All Users ({filteredUsers.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Health Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Risk Label</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>{user.city}</TableCell>
                        <TableCell>
                          <Box sx={{ fontWeight: 600, color: '#0070C0' }}>{user.health_score}</Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={user.risk_label} color={getRiskColor(user.risk_label)} size="small" />
                        </TableCell>
                        <TableCell>{user.last_updated}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                        <Typography color="textSecondary">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Modals */}
      <AddUserModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAddUser={(userData) => {
          addUser(userData);
          setOpenAddModal(false);
        }}
      />

      <UploadUsersModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        onUploadUsers={(uploadedUsers) => {
          addUsers(uploadedUsers);
          setOpenUploadModal(false);
        }}
      />
    </Grid>
  );
}
