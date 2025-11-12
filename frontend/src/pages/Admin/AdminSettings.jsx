import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Stack,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { SaveOutlined, SettingOutlined, BellOutlined, SecurityScanOutlined, DatabaseOutlined } from '@ant-design/icons';
import adminService from 'services/admin.service';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // General Settings
  const [systemName, setSystemName] = useState('HealthScore Bureau');
  const [supportEmail, setSupportEmail] = useState('support@healthscore.com');
  const [maxUploadSize, setMaxUploadSize] = useState('10');
  const [defaultUserRole, setDefaultUserRole] = useState('user');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUserNotifications, setNewUserNotifications] = useState(true);
  const [bulkUploadNotifications, setBulkUploadNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Security Settings
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState(false);

  // Data Settings
  const [dataRetention, setDataRetention] = useState('365');
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await adminService.getAdminSettings();

      // Update state with loaded settings
      setSystemName(settings.systemName);
      setSupportEmail(settings.supportEmail);
      setMaxUploadSize(String(settings.maxUploadSize));
      setDefaultUserRole(settings.defaultUserRole);

      setEmailNotifications(settings.emailNotifications);
      setNewUserNotifications(settings.newUserNotifications);
      setBulkUploadNotifications(settings.bulkUploadNotifications);
      setSystemAlerts(settings.systemAlerts);

      setSessionTimeout(String(settings.sessionTimeout));
      setPasswordExpiry(String(settings.passwordExpiry));
      setTwoFactorAuth(settings.twoFactorAuth);
      setIpWhitelist(settings.ipWhitelist);

      setDataRetention(String(settings.dataRetention));
      setAutoBackup(settings.autoBackup);
      setBackupFrequency(settings.backupFrequency);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSaveError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError('');

      const settings = {
        systemName,
        supportEmail,
        maxUploadSize: parseInt(maxUploadSize),
        defaultUserRole,
        emailNotifications,
        newUserNotifications,
        bulkUploadNotifications,
        systemAlerts,
        sessionTimeout: parseInt(sessionTimeout),
        passwordExpiry: parseInt(passwordExpiry),
        twoFactorAuth,
        ipWhitelist,
        dataRetention: parseInt(dataRetention),
        autoBackup,
        backupFrequency
      };

      await adminService.updateAdminSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveError(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setActionLoading(true);
      setSaveError('');
      const result = await adminService.exportAllData();

      // Download as JSON file
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healthscore-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setActionSuccess('Data exported successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to export data:', error);
      setSaveError(error.response?.data?.message || 'Failed to export data');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setActionLoading(true);
      setSaveError('');
      await adminService.clearCache();
      setActionSuccess('Cache cleared successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      setSaveError(error.response?.data?.message || 'Failed to clear cache');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveRecords = async () => {
    if (!window.confirm('Are you sure you want to archive old records? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      setSaveError('');
      const result = await adminService.archiveOldRecords();
      setActionSuccess(`${result.archivedCount} records archived successfully!`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to archive records:', error);
      setSaveError(error.response?.data?.message || 'Failed to archive records');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Admin Settings
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {saveError}
        </Alert>
      )}

      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {actionSuccess}
        </Alert>
      )}

      <Card elevation={2} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<SettingOutlined />} label="General" iconPosition="start" />
            <Tab icon={<BellOutlined />} label="Notifications" iconPosition="start" />
            <Tab icon={<SecurityScanOutlined />} label="Security" iconPosition="start" />
            <Tab icon={<DatabaseOutlined />} label="Data Management" iconPosition="start" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* General Settings Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  System Configuration
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="System Name"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Support Email"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Upload Size (MB)"
                  type="number"
                  value={maxUploadSize}
                  onChange={(e) => setMaxUploadSize(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Default User Role</InputLabel>
                  <Select
                    value={defaultUserRole}
                    label="Default User Role"
                    onChange={(e) => setDefaultUserRole(e.target.value)}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="insurer">Insurer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Notification Preferences
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                    }
                    label="Enable Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newUserNotifications}
                        onChange={(e) => setNewUserNotifications(e.target.checked)}
                      />
                    }
                    label="Notify on New User Registration"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={bulkUploadNotifications}
                        onChange={(e) => setBulkUploadNotifications(e.target.checked)}
                      />
                    }
                    label="Notify on Bulk Upload Completion"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemAlerts}
                        onChange={(e) => setSystemAlerts(e.target.checked)}
                      />
                    }
                    label="System Alerts & Warnings"
                  />
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Security Settings
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password Expiry (days)"
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactorAuth}
                        onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={ipWhitelist}
                        onChange={(e) => setIpWhitelist(e.target.checked)}
                      />
                    }
                    label="Enable IP Whitelisting"
                  />
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Data Management Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Data Management
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Retention Period (days)"
                  type="number"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  helperText="How long to keep user data before archiving"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Backup Frequency</InputLabel>
                  <Select
                    value={backupFrequency}
                    label="Backup Frequency"
                    onChange={(e) => setBackupFrequency(e.target.value)}
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                    />
                  }
                  label="Enable Automatic Backups"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
                  Database Actions
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleExportData}
                    disabled={actionLoading}
                  >
                    Export All Data
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleClearCache}
                    disabled={actionLoading}
                  >
                    Clear Cache
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleArchiveRecords}
                    disabled={actionLoading}
                  >
                    Archive Old Records
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Save Button */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
              onClick={handleSave}
              disabled={saving}
              sx={{ minWidth: 150 }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

