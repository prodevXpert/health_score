import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';

export default function UploadUsersModal({ open, onClose, onUploadUsers }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have header row and at least one data row');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const requiredFields = [
      'full_name',
      'age',
      'gender',
      'city',
      'lifestyle_score',
      'vitals_score',
      'activity_score',
      'health_score'
    ];

    const missingFields = requiredFields.filter((field) => !headers.includes(field));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const users = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const user = {};

      headers.forEach((header, index) => {
        const value = values[index];
        if (header.includes('score') || header === 'age') {
          user[header] = parseInt(value) || 0;
        } else {
          user[header] = value;
        }
      });

      users.push(user);
    }

    return users;
  };

  const parseJSON = (text) => {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of users');
    }
    return data;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError('');
    setPreview([]);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        let users = [];

        if (selectedFile.name.endsWith('.csv')) {
          users = parseCSV(text);
        } else if (selectedFile.name.endsWith('.json')) {
          users = parseJSON(text);
        } else {
          throw new Error('File must be CSV or JSON');
        }

        if (users.length === 0) {
          throw new Error('No valid users found in file');
        }

        setPreview(users.slice(0, 3));
      } catch (err) {
        setError(err.message);
        setFile(null);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        let users = [];

        if (file.name.endsWith('.csv')) {
          users = parseCSV(text);
        } else {
          users = parseJSON(text);
        }

        onUploadUsers(users);
        setFile(null);
        setPreview([]);
        setError('');
        onClose();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Upload Users</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <Box
            sx={{
              border: '2px dashed #0070C0',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { bgcolor: '#f0f7ff' }
            }}
            component="label"
          >
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <CloudUploadOutlined style={{ fontSize: '2rem', color: '#0070C0' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {file ? file.name : 'Click to upload CSV or JSON'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Supported formats: CSV, JSON
              </Typography>
            </Stack>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </Box>

          {preview.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Preview ({preview.length} of {preview.length}+ users)
              </Typography>
              <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1, fontSize: '0.75rem' }}>
                {preview.map((user, idx) => (
                  <Typography key={idx} variant="caption" display="block">
                    {user.full_name} | Age: {user.age} | Health: {user.health_score}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          <Alert severity="info">
            <Typography variant="caption">
              <strong>CSV Format:</strong> full_name, age, gender, city, lifestyle_score, vitals_score, activity_score,
              health_score
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || loading}
          sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
      {loading && <LinearProgress />}
    </Dialog>
  );
}

