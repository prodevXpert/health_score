import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';

export default function AddUserModal({ open, onClose, onAddUser }) {
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: 'M',
    city: '',
    lifestyle_score: '',
    vitals_score: '',
    activity_score: '',
    health_score: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('score') || name === 'age' ? parseInt(value) || '' : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      setError('Age must be between 1 and 150');
      return false;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }

    const scores = [
      formData.lifestyle_score,
      formData.vitals_score,
      formData.activity_score,
      formData.health_score
    ];

    for (let score of scores) {
      if (score === '' || score < 0 || score > 100) {
        setError('All scores must be between 0 and 100');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAddUser(formData);
      setFormData({
        full_name: '',
        age: '',
        gender: 'M',
        city: '',
        lifestyle_score: '',
        vitals_score: '',
        activity_score: '',
        health_score: ''
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Add New User</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., John Doe"
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 1, max: 150 }}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select name="gender" value={formData.gender} onChange={handleChange} label="Gender">
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., Mumbai"
          />

          <TextField
            label="Lifestyle Score (0-100)"
            name="lifestyle_score"
            type="number"
            value={formData.lifestyle_score}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />

          <TextField
            label="Vitals Score (0-100)"
            name="vitals_score"
            type="number"
            value={formData.vitals_score}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />

          <TextField
            label="Activity Score (0-100)"
            name="activity_score"
            type="number"
            value={formData.activity_score}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />

          <TextField
            label="Health Score (0-100)"
            name="health_score"
            type="number"
            value={formData.health_score}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ background: 'linear-gradient(135deg, #0070C0 0%, #4CAF50 100%)' }}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}

