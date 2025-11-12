import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
  Slider,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  SaveOutlined,
  LogoutOutlined,
  DeleteOutlined,
  HeartOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { userService, preferencesService } from 'services';
import api from 'services/api';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    height: '',
    weight: ''
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Health Preferences
  const [healthPreferences, setHealthPreferences] = useState({
    targetHealthScore: 85,
    targetBMI: 22,
    targetWeight: 70,
    enableHealthReminders: true,
    reminderFrequency: 'weekly',
    nextCheckupDate: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    labUploadReminders: true,
    scoreUpdateNotifications: true,
    healthInsightsNotifications: true,
    recommendationsNotifications: true
  });

  useEffect(() => {
    loadUserData();
    loadPreferences();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setProfile({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        age: userData.age || '',
        height: userData.height || '',
        weight: userData.weight || ''
      });
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await preferencesService.get();
      if (prefs) {
        setHealthPreferences({
          targetHealthScore: prefs.targetHealthScore || 85,
          targetBMI: prefs.targetBMI || 22,
          targetWeight: prefs.targetWeight || 70,
          enableHealthReminders: prefs.enableHealthReminders !== false,
          reminderFrequency: prefs.reminderFrequency || 'weekly',
          nextCheckupDate: prefs.nextCheckupDate || ''
        });
        setNotifications({
          emailNotifications: prefs.emailNotifications !== false,
          smsNotifications: prefs.smsNotifications || false,
          inAppNotifications: prefs.inAppNotifications !== false,
          labUploadReminders: prefs.labUploadReminders !== false,
          scoreUpdateNotifications: prefs.scoreUpdateNotifications !== false,
          healthInsightsNotifications: prefs.healthInsightsNotifications !== false,
          recommendationsNotifications: prefs.recommendationsNotifications !== false
        });
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSaveSuccess(false);
  };

  const handleProfileChange = (field) => (event) => {
    setProfile({ ...profile, [field]: event.target.value });
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData({ ...passwordData, [field]: event.target.value });
  };

  const handleHealthPrefChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setHealthPreferences({ ...healthPreferences, [field]: value });
  };

  const handleNotificationChange = (field) => (event) => {
    setNotifications({ ...notifications, [field]: event.target.checked });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      await userService.updateProfile(profile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError('');

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New password and confirm password do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      await api.patch('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      setSaveSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHealthPreferences = async () => {
    try {
      setLoading(true);
      setError('');
      await preferencesService.update(healthPreferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save health preferences');
      console.error('Error saving preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      await preferencesService.update(notifications);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save notification settings');
      console.error('Error saving notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await api.delete('/users/account');
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to delete account');
      console.error('Error deleting account:', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Settings
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Manage your account settings and preferences
      </Typography>

      {/* Success/Error Alerts */}
      {saveSuccess && (
        <Alert severity="success" onClose={() => setSaveSuccess(false)} sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <MainCard>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<UserOutlined />} label="Profile" iconPosition="start" />
          <Tab icon={<HeartOutlined />} label="Health Preferences" iconPosition="start" />
          <Tab icon={<BellOutlined />} label="Notifications" iconPosition="start" />
          <Tab icon={<LockOutlined />} label="Account" iconPosition="start" />
        </Tabs>

        {/* Tab 1: Profile */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Personal Information</Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profile.fullName}
                  onChange={handleProfileChange('fullName')}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange('email')}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone}
                  onChange={handleProfileChange('phone')}
                />
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={handleProfileChange('dateOfBirth')}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select value={profile.gender} onChange={handleProfileChange('gender')} label="Gender">
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={profile.age}
                      onChange={handleProfileChange('age')}
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      type="number"
                      value={profile.height}
                      onChange={handleProfileChange('height')}
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      type="number"
                      value={profile.weight}
                      onChange={handleProfileChange('weight')}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveOutlined />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                    sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
                  >
                    Save Profile
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Health Preferences */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Health Goals</Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography gutterBottom>Target Health Score: {healthPreferences.targetHealthScore}</Typography>
                  <Slider
                    value={healthPreferences.targetHealthScore}
                    onChange={(e, value) => setHealthPreferences({ ...healthPreferences, targetHealthScore: value })}
                    min={50}
                    max={100}
                    marks={[
                      { value: 50, label: '50' },
                      { value: 70, label: '70' },
                      { value: 85, label: '85' },
                      { value: 100, label: '100' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Target BMI"
                      type="number"
                      value={healthPreferences.targetBMI}
                      onChange={handleHealthPrefChange('targetBMI')}
                      inputProps={{ step: 0.1, min: 15, max: 35 }}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Target Weight (kg)"
                      type="number"
                      value={healthPreferences.targetWeight}
                      onChange={handleHealthPrefChange('targetWeight')}
                      inputProps={{ step: 0.5, min: 30, max: 200 }}
                    />
                  </Grid>
                </Grid>
                <Divider />
                <Typography variant="h6">Health Reminders</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={healthPreferences.enableHealthReminders}
                      onChange={handleHealthPrefChange('enableHealthReminders')}
                    />
                  }
                  label="Enable Health Reminders"
                />
                <FormControl fullWidth>
                  <InputLabel>Reminder Frequency</InputLabel>
                  <Select
                    value={healthPreferences.reminderFrequency}
                    onChange={handleHealthPrefChange('reminderFrequency')}
                    label="Reminder Frequency"
                    disabled={!healthPreferences.enableHealthReminders}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Next Checkup Date"
                  type="date"
                  value={healthPreferences.nextCheckupDate}
                  onChange={handleHealthPrefChange('nextCheckupDate')}
                  InputLabelProps={{ shrink: true }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveOutlined />}
                    onClick={handleSaveHealthPreferences}
                    disabled={loading}
                    sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Notifications */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Notification Channels</Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailNotifications}
                      onChange={handleNotificationChange('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.smsNotifications}
                      onChange={handleNotificationChange('smsNotifications')}
                    />
                  }
                  label="SMS Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.inAppNotifications}
                      onChange={handleNotificationChange('inAppNotifications')}
                    />
                  }
                  label="In-App Notifications"
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>Notification Types</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.labUploadReminders}
                      onChange={handleNotificationChange('labUploadReminders')}
                    />
                  }
                  label="Lab Upload Reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.scoreUpdateNotifications}
                      onChange={handleNotificationChange('scoreUpdateNotifications')}
                    />
                  }
                  label="Score Update Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.healthInsightsNotifications}
                      onChange={handleNotificationChange('healthInsightsNotifications')}
                    />
                  }
                  label="Health Insights"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.recommendationsNotifications}
                      onChange={handleNotificationChange('recommendationsNotifications')}
                    />
                  }
                  label="Personalized Recommendations"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveOutlined />}
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
                  >
                    Save Notifications
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 4: Account */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange('currentPassword')}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange('newPassword')}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange('confirmPassword')}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <LockOutlined />}
                    onClick={handleChangePassword}
                    disabled={loading}
                    sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Stack>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Account Actions</Typography>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<LogoutOutlined />}
                  onClick={handleLogout}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Logout
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={() => setDeleteDialogOpen(true)}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Delete Account
                </Button>
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>Warning:</strong> Deleting your account will permanently remove all your health data and cannot be undone.
                  </Typography>
                </Alert>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>
      </MainCard>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you absolutely sure you want to delete your account? This action cannot be undone and all your health data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteOutlined />}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

