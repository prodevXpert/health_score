import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  UploadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { adminService } from 'services';

export default function BulkUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please select a valid CSV file');
        return;
      }
      setSelectedFile(file);
      setError('');
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const result = await adminService.uploadCsv(selectedFile);
      setUploadResult(result);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = [
      'userEmail',
      'testDate',
      'bloodPressureSystolic',
      'bloodPressureDiastolic',
      'heartRate',
      'respiratoryRate',
      'bodyTemperature',
      'oxygenSaturation',
      'fastingGlucose',
      'hba1c',
      'totalCholesterol',
      'ldlCholesterol',
      'hdlCholesterol',
      'triglycerides',
      'hemoglobin',
      'wbcCount',
      'plateletCount',
      'creatinine',
      'alt',
      'ast',
      'tsh',
      'vitaminD',
      'vitaminB12',
      'smokingStatus',
      'alcoholConsumption',
      'exerciseFrequency',
      'sleepHours',
      'stressLevel',
      'dietQuality',
      'bmi',
      'waistCircumference'
    ];

    const sampleData = [
      'user@example.com',
      '2024-01-15',
      '120',
      '80',
      '72',
      '16',
      '98.6',
      '98',
      '95',
      '5.5',
      '180',
      '100',
      '50',
      '140',
      '14.5',
      '7500',
      '250000',
      '0.9',
      '25',
      '28',
      '2.5',
      '35',
      '450',
      'never',
      'moderate',
      'regular',
      '7',
      'low',
      'good',
      '23.5',
      '85'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health-data-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Bulk Upload Health Data
      </Typography>

      {/* Instructions Card */}
      <Card sx={{ mb: 3, bgcolor: 'primary.lighter' }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <InfoCircleOutlined style={{ fontSize: '20px', color: '#1976d2' }} />
            <Typography variant="h6" color="primary">
              Instructions
            </Typography>
          </Stack>
          <List dense>
            <ListItem>
              <ListItemText primary="1. Download the CSV template using the button below" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Fill in the health data for multiple users (one row per user)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Ensure all required fields are filled correctly" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Upload the completed CSV file" />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. Review the upload results and fix any errors if needed" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <MainCard title="Upload CSV File">
        <Stack spacing={3}>
          {/* Download Template Button */}
          <Box>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
              fullWidth
              sx={{ maxWidth: 300 }}
            >
              Download CSV Template
            </Button>
          </Box>

          <Divider />

          {/* File Selection */}
          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadOutlined />}
                fullWidth
                sx={{ maxWidth: 300 }}
              >
                Select CSV File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
              </Typography>
            )}
          </Box>

          {/* Upload Button */}
          {selectedFile && (
            <Box>
              <Button
                variant="contained"
                color="success"
                onClick={handleUpload}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} /> : <CheckCircleOutlined />}
                fullWidth
                sx={{ maxWidth: 300 }}
              >
                {uploading ? 'Uploading...' : 'Upload and Process'}
              </Button>
            </Box>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <Box>
              <Alert
                severity={uploadResult.failed === 0 ? 'success' : 'warning'}
                icon={uploadResult.failed === 0 ? <CheckCircleOutlined /> : <InfoCircleOutlined />}
              >
                <Typography variant="h6" gutterBottom>
                  Upload Complete
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Chip
                    label={`Success: ${uploadResult.success}`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`Failed: ${uploadResult.failed}`}
                    color={uploadResult.failed > 0 ? 'error' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={`Total: ${uploadResult.total}`}
                    color="info"
                    size="small"
                  />
                </Stack>
              </Alert>

              {/* Error Details Table */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Error Details
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Row</strong></TableCell>
                          <TableCell><strong>User Email</strong></TableCell>
                          <TableCell><strong>Error</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadResult.errors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.userEmail || 'N/A'}</TableCell>
                            <TableCell>
                              <Typography variant="body2" color="error">
                                {error.error}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </MainCard>
    </Box>
  );
}

